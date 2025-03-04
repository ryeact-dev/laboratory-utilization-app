const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');
const { nodeMailer } = require('../util/nodemailer');
const { logger } = require('../util/winstonLogger');
const chalk = require('chalk');
const { uploadedPhoto } = require('../util/photos');

const socketMiddleware = require('../middlewares/socketIo');

const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);

const jwt = require('jsonwebtoken');
const { dbActiveSchoolYear } = require('../util/dbActiveSchoolYear');
const getOnlineUsers = require('../util/onlineUsers');
const jwtSecret = process.env.JWTSECRET;
const clientVersion = process.env.CLIENT_VERSION;

// Set cookie expiration date to one month from now
const currentDate = new Date();
const expirationDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  currentDate.getDate()
);

/**
 * Retrieves current user data and active school year information
 *
 * @param {Object} req - Express request object containing user information
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with current user info and school year details
 */
async function getCurrentUserData(req, res, next) {
  const { client_version } = req.query;

  // Check if client version is valid
  if (client_version !== clientVersion) {
    console.log(
      'client v:',
      client_version,
      ':: api client v:',
      clientVersion,
      ':: user:',
      req.user.full_name
    );
    return res.status(403).send('Invalid client version');
  }

  try {
    // Extract user info excluding email for security
    const { email, ...userInfo } = req.user;

    // Get active school year information
    const {
      school_year,
      ending_date: sy_ending_date,
      starting_date: sy_starting_date,
      sy_is_active,
      id,
      ...rest
    } = await dbActiveSchoolYear();

    // Get active term and semester information
    const termSemResult = await pool.query(
      'SELECT term_sem, starting_date, ending_date FROM term_sem WHERE termsem_is_active = $1 AND school_year = $2',
      [true, school_year]
    );

    const activeSchoolYear =
      { sy_starting_date, sy_ending_date, school_year } || 0;
    const activeTermAndSem = termSemResult.rows[0] || null;

    // Return combined user and school year information
    res.json({
      currentUserInfo: userInfo,
      schoolYearInfo: { ...activeSchoolYear, ...activeTermAndSem },
    });
  } catch (err) {
    err.title = 'Fetch Current Userdata';
    next(err);
  }
}

/**
 * Retrieves a paginated list of users with optional filtering by username
 *
 * @param {Object} req - Express request object with pagination parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated users and pagination info
 */
async function getPaginatedUsers(req, res, next) {
  let { page, perpage, username } = req.query;

  // Ensure page is not negative
  if (page < 0) page = 0;
  perpage = Number(perpage);
  const limit = 200;

  try {
    // Retrieve all matching users without pagination (up to limit)
    const allResults = await pool.query(
      `SELECT * FROM users WHERE full_name ILIKE '%' || $3 || '%' ORDER BY user_role LIMIT $1 OFFSET $2`,
      [Number(limit), 0, username]
    );

    const listOfUsers = allResults.rows;

    // Calculate the start and end indices for the current page
    const startIndex = page * Number(perpage);
    const endIndex = startIndex + Number(perpage);

    // Get the paginated results for the current page
    const paginatedList = Number(perpage)
      ? listOfUsers.slice(startIndex, endIndex)
      : listOfUsers;

    // Determine if there are more results beyond the current page
    const hasMore =
      endIndex === Number(limit) || listOfUsers.length <= endIndex;

    res.json({ users: paginatedList, hasMore });
  } catch (err) {
    err.title = 'Fetching paginated list of users';
    next(err);
  }
}

/**
 * Retrieves a list of faculty members filtered by name
 *
 * @param {Object} req - Express request object with faculty name filter
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with faculty members
 */
async function getListOfFaculty(req, res, next) {
  const { faculty_name } = req.query;

  try {
    // Query to get faculty members (excluding Admin and STA roles)
    const query = `SELECT id, full_name, is_active
                   FROM users 
                   WHERE user_role != 'Admin' AND user_role != 'STA' AND full_name LIKE $1 || '%'
                   ORDER BY full_name`;
    const values = [faculty_name];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching list of faculty';
    next(err);
  }
}

/**
 * Retrieves a list of active Program Heads and Deans
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with Program Heads and Deans
 */
async function getListOfProgramHeadAndDean(req, res, next) {
  try {
    // Query to get active Program Heads and Deans
    const query = `SELECT id, full_name, user_role, user_program, department
                   FROM users 
                   WHERE (user_role = 'Program Head' OR user_role = 'Dean') AND is_active
                   ORDER BY full_name`;

    const result = await pool.query(query, []);

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching list of Program Head and Dean';
    next(err);
  }
}

/**
 * Registers a new user in the system
 *
 * @param {Object} req - Express request object with user details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addUser(req, res, next) {
  const userRole = req.user.user_role;
  // Only Admin can add users
  if (userRole !== 'Admin') return res.status(404).send('Unauthorized');

  const {
    email,
    full_name,
    password,
    user_role,
    laboratory,
    user_program,
    department,
  } = req.body;

  // Normalize email to lowercase and trim whitespace
  const normalizedEmail = email.trim().toLowerCase();

  let laboratoryArray;

  // Convert laboratory string to array for non-Admin and non-Dean roles
  if (user_role !== 'Admin' || user_role !== 'Dean')
    laboratoryArray = laboratory.split(',');

  try {
    // Check if the email already exists in the database
    const existingUserQuery = await pool.query(
      'SELECT email FROM users WHERE email ILIKE $1',
      [normalizedEmail]
    );

    if (existingUserQuery.rows.length > 0) {
      const foundData = existingUserQuery.rows[0];

      if (foundData.email.trim().toLowerCase() === normalizedEmail) {
        return res.status(409).send('Email already exist.');
      }
    }

    // Generate unique ID and hash password
    const id = uuidv4();
    const dateAdded = new Date();
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    // Process photo upload if provided
    const multerPhoto = req.files['photo_url']
      ? await uploadedPhoto(
          req.files['photo_url'][0],
          current_photo,
          full_name,
          false
        )
      : null;

    // Process e-signature upload if provided
    const multerEsign = req.files['esign_url']
      ? await uploadedPhoto(
          req.files['esign_url'][0],
          current_esign,
          full_name,
          true
        )
      : null;

    // Prepare columns and values for insertion
    const columns = [
      'id',
      'email',
      'full_name',
      'user_password',
      'user_role',
      'laboratory',
      'photo_url',
      'esign_url',
      'user_program',
      'department',
      'date_added',
    ];
    const values = [
      id,
      normalizedEmail,
      full_name,
      hashedPassword,
      user_role,
      laboratoryArray,
      multerPhoto,
      multerEsign,
      user_program,
      department,
      dateAdded,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new user into the database
    const query = `
          INSERT INTO 
              users (${columnNames}) 
          VALUES 
              (${placeholders}) 
          `;

    await pool.query(query, values);

    // Send welcome email with default password
    nodeMailer(
      req.body,
      'Welcome to LUMENS, your default password is here:',
      `Succesfully sent the email to ${email}`
    );

    // Log the successful registration
    logger.info(
      chalk.blue(
        `${full_name} successfully registered as ${user_role} ${dateConverter()}`
      )
    );
    res.json();
  } catch (err) {
    err.title = 'Adding new user';
    next(err);
  }
}

/**
 * Updates an existing user's information
 *
 * @param {Object} req - Express request object with updated user details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with updated user information
 */
async function updateUser(req, res, next) {
  const {
    id,
    email,
    full_name,
    user_role,
    // laboratory,
    current_photo,
    current_esign,
    user_program,
    department,
  } = req.body;

  // Normalize email to lowercase and trim whitespace
  const normalizedEmail = email.trim().toLowerCase();
  // const mutatedLaboratory = laboratory.split(',');

  // Process photo upload if provided, otherwise keep current photo
  const multerPhoto = req.files['photo_url']
    ? await uploadedPhoto(
        req.files['photo_url'][0],
        current_photo,
        full_name,
        false
      )
    : current_photo;

  // Process e-signature upload if provided, otherwise keep current e-signature
  const multerEsign = req.files['esign_url']
    ? await uploadedPhoto(
        req.files['esign_url'][0],
        current_esign,
        full_name,
        true
      )
    : current_esign;

  try {
    // Check if the email exists for another user
    const existingUserQuery = await pool.query(
      'SELECT id FROM users WHERE email ILIKE $1',
      [normalizedEmail]
    );

    if (existingUserQuery.rows.length > 0) {
      const foundData = existingUserQuery.rows[0];

      // If email exists but belongs to a different user, return error
      if (foundData.id !== id)
        return res.status(409).send('Email already exist.');
    }

    // Update user information in the database
    const query = `
      UPDATE 
        users 
      SET
        email = $1, full_name = $2, user_role = $3, photo_url = $4, esign_url = $5, user_program = $6, department = $7
      WHERE 
        id = $8
      RETURNING
        email, full_name, user_role, laboratory, photo_url, esign_url, department
      `;

    const values = [
      normalizedEmail,
      full_name,
      user_role,
      // mutatedLaboratory,
      multerPhoto,
      multerEsign,
      user_program,
      department,
      id,
    ];

    const updatedUser = await pool.query(query, values);

    // Notify connected clients about the user update
    const io = socketMiddleware.getIO();
    io.emit('user:updated');

    res.json(updatedUser.rows[0]);
    logger.info(
      chalk.blue(
        `${full_name}'s data successfully updated on ${dateConverter()}`
      )
    );
  } catch (err) {
    err.title = 'Updating user';
    next(err);
  }
}

/**
 * Updates a user's password
 *
 * @param {Object} req - Express request object with password details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function updateUserPassword(req, res, next) {
  const { userId, newPassword, currentPassword, isUpdatePassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, bcryptSalt);

  try {
    // Handle password update (requires current password verification)
    if (isUpdatePassword) {
      const userQuery = await pool.query(
        'SELECT email, user_password FROM users WHERE id = $1',
        [userId]
      );

      // If no user found, return error
      if (!userQuery.rows.length > 0) {
        return res.status(404).send('User not found');
      }

      // Get user email and current password hash
      const userEmail = userQuery.rows[0].email;
      const userOldPassword = userQuery.rows[0].user_password;

      // Verify current password before updating
      if (userQuery) {
        const passOk = bcrypt.compareSync(currentPassword, userOldPassword);
        if (passOk) {
          // Update password if current password is correct
          await pool.query(
            'UPDATE users SET user_password = $1 WHERE email = $2',
            [hashedPassword, userEmail]
          );
          logger.info(
            chalk.blue(
              `Password of ${userEmail} has been successfully updated :: ${dateConverter()}`
            )
          );
          res.json();
        } else {
          return res.status(401).send('Current Password mismatch');
        }
      }
    } else {
      // Handle password reset (no current password verification required)
      await pool.query('UPDATE users SET user_password = $1 WHERE id = $2', [
        hashedPassword,
        userId,
      ]);
      logger.info(
        chalk.blue(`Password successfully resetted :: ${dateConverter()}`)
      );
      res.json();
    }
  } catch (err) {
    err.title = 'Updating user password';
    next(err);
  }
}

/**
 * Updates a user's active status (activate/deactivate)
 *
 * @param {Object} req - Express request object with user ID and status
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function updateUserStatus(req, res, next) {
  const userRole = req.user.user_role;
  // Only Admin can update user status
  if (userRole !== 'Admin') return res.status(404).send('Unauthorized');

  const { is_active, id } = req.body;

  try {
    // Toggle the user's active status
    await pool.query('UPDATE users SET is_active = $1 WHERE id = $2', [
      !is_active,
      id,
    ]);
    res.json();
  } catch (err) {
    err.title = 'Updating user status';
    next(err);
  }
}

/**
 * Assigns laboratories to a user
 *
 * @param {Object} req - Express request object with user ID and laboratories
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function assignUserLaboratories(req, res, next) {
  const { userId, laboratory } = req.body;

  try {
    // Update user's laboratory assignments
    await pool.query('UPDATE users SET laboratory = $1 WHERE id = $2', [
      laboratory,
      userId,
    ]);

    // Notify connected clients about the user update
    const io = socketMiddleware.getIO();
    io.emit('user:updated');

    res.json();
  } catch (err) {
    err.title = 'Updating user laboratories';
    next(err);
  }
}

/**
 * Assigns offices to a user
 *
 * @param {Object} req - Express request object with user ID and office
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function assignUserOffices(req, res, next) {
  const { userId, office } = req.body;

  try {
    // Update user's office assignments
    await pool.query('UPDATE users SET office = $1 WHERE id = $2', [
      office,
      userId,
    ]);
    res.json();
  } catch (err) {
    err.title = 'Updating user office';
    next(err);
  }
}

/**
 * Authenticates a user and creates a session
 *
 * @param {Object} req - Express request object with login credentials
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with user information on successful login
 */
async function userLogin(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Find user by email
    const userData = await pool.query(
      'SELECT * FROM users WHERE email ILIKE $1',
      [normalizedEmail]
    );

    // If no user found with the email, return error
    if (!userData.rows.length)
      return res.status(404).send('Email does not exist!');

    // Check if user account is active
    if (userData.rows[0].is_active === false)
      return res
        .status(401)
        .send('Your account is deactivated. Please contact the administrator.');

    if (userData) {
      // Verify password
      const passOk = bcrypt.compareSync(
        password,
        userData.rows[0].user_password
      );

      const user_id = userData.rows[0].id;

      if (passOk) {
        // Generate JWT token for authentication
        const token = jwt.sign({ id: user_id }, jwtSecret);
        const { user_password, date_added, ...rest } = userData.rows[0];

        // Set authentication cookie
        res.cookie('auth_token', token, {
          maxAge: expirationDate,
          httpOnly: true,
        });

        // Update online users list
        const onlineUsers = getOnlineUsers(user_id, true);

        // Notify connected clients about the updated online users list
        const io = socketMiddleware.getIO();
        io.emit('online-users', { data: onlineUsers, message: 'online-users' });

        res.status(200).json(rest);
      } else {
        return res.status(401).send('Wrong Password!');
      }
    }
  } catch (err) {
    err.title = 'Login error';
    next(err);
  }
}

/**
 * Authenticates a user via Google Auth and creates a session
 *
 * @param {Object} req - Express request object with Google Auth details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with user information on successful login
 */
async function googleLogin(req, res, next) {
  const { email, photo_url } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // Security check for photo URL
  if (!photo_url.toString().includes('https'))
    return res.status(403).send('This action is not allowed');

  try {
    // Update user's photo URL and retrieve user data
    const userData = await pool.query(
      'UPDATE users SET photo_url = $1 WHERE email ILIKE $2 RETURNING *',
      [photo_url, normalizedEmail]
    );

    // If no user found with the email, return error
    if (!userData.rows.length)
      return res.status(404).send('Email does not exist!');

    const user_id = userData.rows[0].id;
    const { user_password, date_added, ...rest } = userData.rows[0];

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user_id }, jwtSecret);

    // Set authentication cookie
    res.cookie('auth_token', token, { maxAge: expirationDate, httpOnly: true });
    res.status(200).json({ ...rest, photo_url });
  } catch (err) {
    err.title = 'Google Auth login error';
    next(err);
  }
}

/**
 * Deletes a user from the system
 *
 * @param {Object} req - Express request object with user ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with success message
 */
async function deleteUser(req, res, next) {
  const userRole = req.user.user_role;
  // Only Admin can delete users
  if (userRole !== 'Admin') return res.status(404).send('Unauthorized');

  const { userId } = req.params;
  try {
    // Prevent deletion of the system owner account
    if (userId === '416d9543-2d4e-469c-a675-2c7f2974cd54') {
      return res.status(403).send('Cannot delete the onwer');
    }

    // Get user email for logging
    const userQuery = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    const userEmail = userQuery.rows[0].email;
    const dateDeleted = dateConverter();

    // Delete the user
    await pool.query('DELETE FROM users WHERE id = $1;', [userId]);
    res.json({ detail: 'User successfully deleted.' });
    logger.info(
      `${userEmail}'s data has successfully deleted by ${req.user.email} ::  ${dateDeleted}`
    );
  } catch (err) {
    err.title = 'Deleting user';
    next(err);
  }
}

/**
 * Logs out a user by clearing their authentication cookie
 *
 * @param {Object} req - Express request object with user information
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with success message
 */
function userLogout(req, res, next) {
  const { id } = req.user;

  try {
    // Update online users list
    const onlineUsers = getOnlineUsers(id, false);

    // Notify connected clients about the updated online users list
    const io = socketMiddleware.getIO();
    io.emit('online-users', { data: onlineUsers, message: 'online-users' });

    // Clear authentication cookie
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    err.title = 'Logout user';
    next(err);
  }
}

/**
 * Send a page refresh event to connected clients
 *
 * @param {Object} req - Express request object with user information
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with success message
 */
function pageReload(req, res, next) {
  const { full_name } = req.user;

  try {
    // Notify connected clients about the user update
    const io = socketMiddleware.getIO();
    io.emit('page:reload');

    logger.info(`Page reload by ${full_name} :: ${dateConverter()}`);
    res.json();
  } catch (err) {
    err.title = 'Page refresh';
    next(err);
  }
}

exports.getCurrentUserData = getCurrentUserData;
exports.getPaginatedUsers = getPaginatedUsers;
exports.getListOfFaculty = getListOfFaculty;
exports.getListOfProgramHeadAndDean = getListOfProgramHeadAndDean;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.updateUserPassword = updateUserPassword;
exports.updateUserStatus = updateUserStatus;
exports.assignUserLaboratories = assignUserLaboratories;
exports.assignUserOffices = assignUserOffices;
exports.userLogin = userLogin;
exports.deleteUser = deleteUser;
exports.userLogout = userLogout;
exports.googleLogin = googleLogin;
exports.pageReload = pageReload;
