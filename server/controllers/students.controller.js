const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const readXlsxFile = require('read-excel-file/node');
const { dateConverter } = require('../util/dateConverter');
const { logger } = require('../util/winstonLogger');
const chalk = require('chalk');
const { uploadedPhoto } = require('../util/photos');
const { isUserAllowed } = require('../util/isUserAllowed');

/**
 * Retrieves all students' names and IDs based on student ID number
 *
 * @param {Object} req - Express request object with user role and query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with student details
 */
async function getAllStudentsNamesAndIds(req, res, next) {
  const { user_role } = req.user;
  const { student_id_number } = req.query;

  // Check if the user is allowed to access this endpoint
  const isAllowed = isUserAllowed(user_role);
  if (!isAllowed) return res.status(401).send('Unauthorized');

  try {
    // Query to get student details by ID number
    let query = `
                SELECT 
                  id, id_number, full_name 
                FROM 
                  students 
                WHERE 
                  id_number = $1`;

    const listOfAllStudents = await pool.query(query, [
      Number(student_id_number),
    ]);

    res.json(listOfAllStudents.rows[0]);
  } catch (err) {
    err.title = 'Fetching all students names and ids';
    next(err);
  }
}

/**
 * Retrieves a paginated list of students
 *
 * @param {Object} req - Express request object with pagination parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated student data
 */
async function getPaginatedStudents(req, res, next) {
  const { studentid, perpage } = req.query;
  let { page } = req.query;

  // Ensure page is not negative
  if (Number(page) < 0) page = 0;

  try {
    const convertedPerPage = Number(perpage);
    let query = 'SELECT * FROM students';
    let values = [];

    // If a student ID is provided, filter by it
    if (studentid > 0) {
      query +=
        " WHERE CAST(id_number AS TEXT) LIKE $1 || '%' ORDER BY full_name LIMIT $2 OFFSET $3";
      values = [studentid, convertedPerPage, Number(page) * convertedPerPage];
    } else {
      // No student ID provided, just paginate
      query += ' ORDER BY full_name LIMIT $1 OFFSET $2';
      values = [convertedPerPage, Number(page) * convertedPerPage];
    }

    // Execute the query to get students
    const resultPromise = await pool.query(query, values);
    const countResultPromise = await pool.query(
      'SELECT COUNT(*) FROM students',
      []
    );

    // Execute both queries concurrently
    const [result, countResult] = await Promise.all([
      resultPromise,
      countResultPromise,
    ]);

    // Check if there are more results for pagination
    const hasMore = result.rows.length === convertedPerPage;

    return res.json({
      students: result.rows,
      hasMore,
      countResult: countResult.rows[0].count,
    });
  } catch (err) {
    err.title = 'Fetching paginated list of students';
    next(err);
  }
}

/**
 * Retrieves the class list of students for a single subject
 *
 * @param {Object} req - Express request object with class list in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with sorted list of students
 */
async function getSingleSubjectClasslist(req, res, next) {
  const { classlist } = req.body;

  try {
    // Retrieve all data matching the class list without pagination
    const students = await pool.query(
      'SELECT id, id_number, full_name FROM students WHERE id = ANY($1)',
      [classlist]
    );

    const listOfStudents = students.rows;

    // Sort the entire list of students based on the order of UUIDs in classlist
    listOfStudents.sort((a, b) => {
      const aIndex = classlist.indexOf(a.id);
      const bIndex = classlist.indexOf(b.id);
      return aIndex - bIndex;
    });

    res.json(listOfStudents);
  } catch (err) {
    err.title = 'Fetching single subject classlist of students';
    next(err);
  }
}

/**
 * Retrieves a paginated class list of students
 *
 * @param {Object} req - Express request object with class list and pagination info in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated class list of students
 */
async function getPaginatedClasslist(req, res, next) {
  const { classlist, page, studentsCount } = req.body;

  try {
    // Retrieve all data matching the class list without pagination
    const allResults = await pool.query(
      'SELECT id, id_number, full_name, photo, e_sign FROM students WHERE id = ANY($1) LIMIT $2 OFFSET $3',
      [classlist, 60, 0]
    );

    const listOfStudents = allResults.rows;

    // Sort the entire list of students based on the order of UUIDs in classlist
    listOfStudents.sort((a, b) => {
      const aIndex = classlist.indexOf(a.id);
      const bIndex = classlist.indexOf(b.id);
      return aIndex - bIndex;
    });

    // Calculate the start index and end index for the current page
    const startIndex = page * studentsCount;
    const endIndex = startIndex + studentsCount;

    // Get the paginated results for the current page
    const paginatedList = studentsCount
      ? listOfStudents.slice(startIndex, endIndex)
      : listOfStudents;

    const hasMore = listOfStudents.length < endIndex;

    res.json({ students: paginatedList, hasMore });
  } catch (err) {
    err.title = 'Fetching paginated classlist of students';
    next(err);
  }
}

/**
 * Registers a new student
 *
 * @param {Object} req - Express request object with student details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addStudent(req, res, next) {
  const {
    id_number,
    full_name,
    department,
    addedBy,
    current_photo,
    current_esign,
  } = req.body;

  // Handle photo upload if provided
  const multerPhoto = req.files['photo']
    ? await uploadedPhoto(
        req.files['photo'][0],
        current_photo,
        id_number,
        false
      )
    : current_photo;

  // Handle e-signature upload if provided
  const multerEsign = req.files['esign']
    ? await uploadedPhoto(req.files['esign'][0], current_esign, id_number, true)
    : current_esign;

  try {
    // Check if the student already exists
    const result = await pool.query(
      'SELECT id_number, full_name FROM students WHERE id_number = $1',
      [id_number]
    );

    const fetchedStudent = result.rows;

    if (fetchedStudent.length > 0) {
      const fetchedName = fetchedStudent[0].full_name;
      return res
        .status(409)
        .send(`ID Number ${id_number} already exists owned by ${fetchedName}`);
    }

    // Generate a unique ID for the new student
    const id = uuidv4();
    const createdAt = new Date();
    const columns = [
      'id',
      'id_number',
      'full_name',
      'department',
      'photo',
      'e_sign',
      'created_at',
    ];
    const values = [
      id,
      id_number,
      full_name,
      department,
      multerPhoto,
      multerEsign,
      createdAt,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new student into the database
    const query = `INSERT INTO students (${columnNames}) VALUES (${placeholders})`;
    await pool.query(query, values);

    res.json();
    logger.info(
      chalk.blue(
        `${id_number}-${full_name} successfully registered by ${addedBy}`
      )
    );
  } catch (err) {
    err.title = 'Adding new student';
    next(err);
  }
}

/**
 * Adds multiple students in bulk from an Excel file
 *
 * @param {Object} req - Express request object with file and addedBy in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with duplicates and count of added students
 */
async function addBulkStudents(req, res, next) {
  const rows = await readXlsxFile(req.file.path);
  const { addedBy } = req.body;
  const duplicates = [];
  let count = 0;

  console.log('rows', rows, addedBy);

  try {
    // Loop through each row in the Excel file
    for (let i = 1; i < rows.length; i++) {
      const [idNumber, fullName] = rows[i];
      const { rows: duplicateRows } = await pool.query(
        'SELECT id_number, full_name FROM students WHERE id_number = $1 OR full_name = $2',
        [idNumber, fullName]
      );

      // Check for duplicates
      if (duplicateRows.length > 0) {
        duplicates.push(duplicateRows[0]);
      } else {
        // Insert new student if no duplicates found
        const id = uuidv4();
        const createdAt = new Date();
        const columns = ['id', 'id_number', 'full_name', 'created_at'];
        const values = [id, idNumber, fullName, createdAt];

        const columnNames = columns.join(', ');
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO students (${columnNames}) VALUES (${placeholders})`;
        await pool.query(query, values);

        count++;
      }
    }
    res.json({ duplicates, count });
    logger.info(
      chalk.blue(
        `Bulk students successfully registered by ${addedBy} :: ${dateConverter()}`
      )
    );
  } catch (err) {
    err.title = 'Adding bulk students';
    next(err);
  }
}

/**
 * Updates an existing student's information
 *
 * @param {Object} req - Express request object with updated student details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateStudent(req, res, next) {
  const {
    id,
    id_number,
    full_name,
    department,
    addedBy,
    current_photo,
    current_esign,
  } = req.body;

  try {
    // Check if the student ID number already exists
    const result = await pool.query(
      'SELECT id, id_number, full_name FROM students WHERE id_number = $1',
      [id_number]
    );

    const fetchedStudent = result.rows;

    if (fetchedStudent.length > 0) {
      const fetchedName = fetchedStudent[0].full_name;
      if (fetchedStudent[0].id !== id)
        return res
          .status(409)
          .send(
            `ID Number ${id_number} already exists owned by ${fetchedName}`
          );
    }

    // Handle photo upload if provided
    const multerPhoto = req.files['photo']
      ? await uploadedPhoto(
          req.files['photo'][0],
          current_photo,
          id_number,
          false
        )
      : current_photo;

    // Handle e-signature upload if provided
    const multerEsign = req.files['esign']
      ? await uploadedPhoto(
          req.files['esign'][0],
          current_esign,
          id_number,
          true
        )
      : current_esign;

    const updatedAt = new Date();

    // Prepare columns and values for update
    const columns = [
      'id_number',
      'full_name',
      'department',
      'photo',
      'e_sign',
      'created_at',
    ];
    const values = [
      id_number,
      full_name,
      department,
      multerPhoto,
      multerEsign,
      updatedAt,
    ];

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    const query = `UPDATE students SET ${setValues} WHERE id = '${id}'`;
    await pool.query(query, values);

    res.json();
    logger.info(
      chalk.blue(
        `${id_number}-${full_name} successfully updated by ${addedBy} on ${updatedAt}`
      )
    );
  } catch (err) {
    err.title = 'Updating a student';
    next(err);
  }
}

/**
 * Syncs e-signature URLs for a student
 *
 * @param {Object} req - Express request object with student ID number in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function syncStudentEsignUrls(req, res, next) {
  const { studentIdNumber } = req.body;

  try {
    // Retrieve student details by ID number
    const student = await pool.query(
      'SELECT id, id_number, full_name, e_sign FROM students WHERE id_number = $1',
      [studentIdNumber]
    );

    const studentId = student.rows[0].id;
    const studentESign = student.rows[0].e_sign;

    const updatedAt = new Date();

    // Prepare columns and values for update
    const columns = ['e_sign', 'updated_at'];
    const values = [studentESign, updatedAt];

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    const query = `UPDATE students SET ${setValues} WHERE id = '${studentId}'`;
    await pool.query(query, values);

    res.json();
    logger.info(
      chalk.blue(
        `${studentIdNumber}-${student.rows[0].full_name} successfully updated by ${req.user.fullName} on ${updatedAt}`
      )
    );
  } catch (err) {
    err.title = 'Updating a student';
    next(err);
  }
}

/**
 * Deletes a student record
 *
 * @param {Object} req - Express request object with student ID number and UUID in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteStudent(req, res, next) {
  const userRole = req.user.user_role;
  if (userRole !== 'Admin') return next(errorHandler(404, 'Unauthorized'));

  const { studentIdNumber, studentUUID } = req.body;

  try {
    // Delete student record from the database
    const deletedStudent = await pool.query(
      `DELETE FROM students WHERE id_number = $1 AND id = $2 RETURNING *`,
      [studentIdNumber, studentUUID]
    );
    logger.info(chalk.blue(deletedStudent.rows));
    logger.info(
      chalk.blue(
        'The above student record has been removed :: ' + dateConverter()
      )
    );
    res.json();
  } catch (err) {
    err.title = 'Deleting a student';
    next(err);
  }
}

exports.getPaginatedStudents = getPaginatedStudents;
exports.getPaginatedClasslist = getPaginatedClasslist;
exports.addStudent = addStudent;
exports.addBulkStudents = addBulkStudents;
exports.updateStudent = updateStudent;
exports.deleteStudent = deleteStudent;
exports.getSingleSubjectClasslist = getSingleSubjectClasslist;
exports.getAllStudentsNamesAndIds = getAllStudentsNamesAndIds;
