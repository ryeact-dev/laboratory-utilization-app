const pool = require('../config/db.config');

const socketMiddleware = require('../middlewares/socketIo');

/**
 * Retrieves a paginated list of stock card items for MISM
 *
 * @param {Object} req - Express request object with user and query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of MISM items and pagination info
 */
async function getPaginatedListOfMISM(req, res, next) {
  const {
    user_role: userRole,
    laboratory: userLaboratory,
    office: userOffice,
  } = req.user;

  const { search_term, page, limit, laboratory, category, schoolyear, date } =
    req.query;

  try {
    // Ensure page number is not negative
    if (Number(page) < 0) page = 0;

    // Base query to retrieve stock card items
    let query = `    
    SELECT 
      sm.*,
      u.full_name AS submitted_by, u.esign_url AS submitted_esign 
    FROM 
      stockcard_mism AS sm
    INNER JOIN
      users AS u ON sm.submitted_by = u.id
    WHERE
      sm.date_submitted <= $1
    `;

    // Query to count items for acknowledgment
    let query2 = `
    SELECT
      COUNT (id)
    FROM
      stockcard_mism
    WHERE
     step = 1 AND date_submitted <= $1
    `;

    let values = [new Date(date)];
    let values2 = [new Date(date)];

    // Filter by category if specified
    if (category === '1') {
      query += ` AND step = '1' `;
    } else if (category === '2') {
      query += ` AND step = '2' `;
    }

    // Filter by laboratory if specified
    if (laboratory !== 'undefined') {
      let selectedLaboratory = [];
      if (laboratory === 'All Laboratories' || laboratory === 'All Offices') {
        if (userRole !== 'Admin' && userRole !== 'Dean') {
          selectedLaboratory = Array.isArray(userLaboratory)
            ? userLaboratory
            : [userLaboratory];

          selectedLaboratory = userOffice
            ? [...selectedLaboratory, ...userOffice]
            : selectedLaboratory;
        } else {
          selectedLaboratory = null;
        }
      } else {
        selectedLaboratory = [laboratory];
      }

      // Add laboratory filter to the query
      query += ` AND ($2::text[] IS NULL OR laboratory_name = ANY($2::text[])) `;
      query2 += ` AND ($2::text[] IS NULL OR laboratory_name = ANY($2::text[])) `;
      values.push(selectedLaboratory);
      values2.push(selectedLaboratory);
    }

    // Order results by submission date
    query += ' ORDER BY date_submitted DESC';

    // Execute both queries concurrently
    const listOfMISMQuery = pool.query(query, values);
    const forAcknowledgementQuery = pool.query(query2, values2);

    const [listOfMISM, forAcknowledgement] = await Promise.all([
      listOfMISMQuery,
      forAcknowledgementQuery,
    ]);

    // Determine if there are more results for pagination
    const hasMore = listOfMISM.rows.length === Number(limit);

    res.json({
      listOfMISM: listOfMISM.rows,
      hasMore,
      forAcknowledgementCount: forAcknowledgement.rows[0].count,
    });
  } catch (err) {
    err.title = 'GET Stock Card MISM';
    next(err);
  }
}

/**
 * Retrieves notifications for items that require acknowledgment
 *
 * @param {Object} req - Express request object with school year
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with items for acknowledgment
 */
async function getForAcknowledgementNotifications(req, res, next) {
  const { schoolyear } = req.query;

  try {
    // Query to get items that need acknowledgment for the specified school year
    let query2 = `
      SELECT
        sm.*, u.full_name AS submitted_by
      FROM
        stockcard_mism AS sm
      INNER JOIN
        users AS u ON sm.submitted_by = u.id  
      WHERE
        sm.school_year = $1 AND sm.step = 1 
      `;

    let values = [schoolyear];

    const forAcknowledgement = await pool.query(query2, values);

    res.json(forAcknowledgement.rows);
  } catch (err) {
    err.title = 'GET FOR ACKNOWLEDGEMENT COUNT';
    next(err);
  }
}

/**
 * Adds a new submitted MISM item to the database
 *
 * @param {Object} req - Express request object with user ID and item details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function addSubmittedMISM(req, res, next) {
  const { id: userId } = req.user;

  const forAddingDate = {
    ...req.body,
    submitted_by: userId,
  };

  try {
    // Prepare columns and values for insertion
    const columns = [];
    for (const name in forAddingDate) {
      columns.push(`${name}`);
    }
    let values = [];
    for (const name in forAddingDate) {
      values.push(forAddingDate[name]);
    }
    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new MISM item into the database
    await pool.query(
      `INSERT INTO stockcard_mism (${columnNames}) VALUES (${placeholders}) RETURNING id`,
      values
    );

    // Notify connected clients about the new submission
    const io = socketMiddleware.getIO();
    io.emit('report:mism-submissions');

    res
      .status(200)
      .send(`Submission of MISM for the Month of April successfully submitted`);
  } catch (err) {
    err.title = 'ADDING MISM Submission';
    next(err);
  }
}

/**
 * Acknowledges selected MISM items
 *
 * @param {Object} req - Express request object with user ID and selected MISM IDs
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function acknowledgeMISM(req, res, next) {
  const { id: userId, user_role } = req.user;
  const { selectedMISMIds } = req.body;

  const currentDate = new Date();

  try {
    // Only Admin can acknowledge MISM items
    if (user_role !== 'Admin') {
      return res.status(401).send('Unauthorized user');
    }

    // Update the acknowledged status of the selected MISM items
    await pool.query(
      `UPDATE stockcard_mism SET acknowledged_by = $1, date_acknowledged = $2, step = 2 WHERE id = ANY($3)`,
      [userId, currentDate, selectedMISMIds]
    );

    // Notify connected clients about the acknowledgment
    const io = socketMiddleware.getIO();
    io.emit('report:mism-submissions');

    res.json();
  } catch (err) {
    err.title = 'UPDATE acknowledged MISM';
    next(err);
  }
}

/**
 * Deletes a MISM item from the database
 *
 * @param {Object} req - Express request object with MISM ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function deleteMISM(req, res, next) {
  const { id } = req.params;

  try {
    // Delete the specified MISM item from the database
    await pool.query(`DELETE FROM stockcard_mism WHERE id = $1`, [id]);
    res.json();
  } catch (err) {
    err.title = 'Deleting MISM';
    next(err);
  }
}

exports.getPaginatedListOfMISM = getPaginatedListOfMISM;
exports.getForAcknowledgementNotifications = getForAcknowledgementNotifications;
exports.addSubmittedMISM = addSubmittedMISM;
exports.acknowledgeMISM = acknowledgeMISM;
exports.deleteMISM = deleteMISM;
