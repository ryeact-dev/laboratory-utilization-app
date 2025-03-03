const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');

const bcrypt = require('bcryptjs');
const {
  update_stockcard_items_tru_released_borrower_slip,
  update_stockcard_items_tru_returned_borrower_slip,
} = require('../util/update_stockcard_items');

/**
 * Retrieves paginated laboratory borrower slips with filtering options
 *
 * @param {Object} req - Express request object with filter parameters in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with borrower slips
 */
async function getPaginatedLabBorrowerSlips(req, res, next) {
  const {
    id: userId,
    laboratory: userLaboratory,
    user_role: userRole,
  } = req.user;
  const { laboratory, is_custodian, termsem, was_returned, bslip_status } =
    req.query;

  // Check if user can view all laboratories
  const isAllowedToViewAllLaboratories =
    userRole === 'Admin' || userRole === 'Dean';

  try {
    // Base query for fetching borrower slips with related data
    let borrowerSlipsQuery = `
       SELECT 
          bsl.*, 
          s.title, s.code, s.program, s.instructor_id,
          st.full_name AS full_name, st.id_number AS id_number, CAST(id_number AS TEXT), st.e_sign AS student_esign,
          us.full_name AS created_by,
          u.full_name AS instructor, u.esign_url AS instructor_esign,
          bslu.released_date AS released_date, bslu.returned_date AS returned_date
        FROM
          borrower_slip_lab AS bsl
        LEFT JOIN
          borrower_slip_lab_users AS bslu ON bsl.id = bslu.borrower_slip_id    
        LEFT JOIN
          borrower_slip_lab_items AS bsli ON bsl.id = bsli.borrower_slip_id
        INNER JOIN
          subjects AS s ON bsl.subject_id = s.id
        LEFT JOIN
          students AS st ON bsl.borrower_id = st.id
        INNER JOIN
          users AS u ON s.instructor_id = u.id  
        INNER JOIN
         users AS us ON bsl.user_id = us.id 
        `;

    // Determine laboratory filter based on user permissions
    const selectedLaboratory =
      laboratory === 'All Laboratories' && isAllowedToViewAllLaboratories
        ? ''
        : laboratory;

    let queryParams = [selectedLaboratory];

    // Add laboratory filter condition
    borrowerSlipsQuery += `WHERE (bsl.laboratory = $1 OR $1 = '')`;

    // Add status filter conditions
    switch (bslip_status) {
      case 'for_release':
        borrowerSlipsQuery += `AND bslu.released_date IS NULL`;
        break;
      case 'for_return':
        borrowerSlipsQuery += `AND bslu.released_date IS NOT NULL AND bslu.returned_date IS NULL`;
        break;
      case 'returned':
        borrowerSlipsQuery += `AND bslu.returned_date IS NOT NULL`;
        break;
      default:
        break;
    }

    // Add instructor filter if not a custodian
    if (is_custodian === 'false') {
      borrowerSlipsQuery += `AND s.instructor_id = $2`;
      queryParams.push(userId);
    }

    // TODO: ADD PAGINATION CODE

    // Add grouping and sorting
    borrowerSlipsQuery += `
          GROUP BY 
              bsl.id,
              s.title, s.code, s.program,  s.instructor_id,
              st.id_number, st.e_sign, st.full_name,
              u.full_name, u.esign_url,
              us.full_name,
              bslu.released_date, bslu.returned_date
           ORDER BY
              bslu.released_date IS NULL DESC,
              bsl.created_at DESC
          `;

    const borrowerSlipsResult = await pool.query(
      borrowerSlipsQuery,
      queryParams
    );

    res.json(borrowerSlipsResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching all lab borrower slip';
    next(err);
  }
}

/**
 * Retrieves a single laboratory borrower slip with all details
 *
 * @param {Object} req - Express request object with slip ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with borrower slip details
 */
async function getSingleLabBorrowerSlip(req, res, next) {
  const { id } = req.params;

  try {
    // Query to get detailed borrower slip data with related information
    let borrowerSlipQuery = `
        SELECT 
          bsl.*, 
          s.title, s.code, s.program, s.instructor_id,
          st.full_name AS full_name, st.id_number AS id_number, CAST(id_number AS TEXT), st.e_sign AS student_esign,
          us.full_name AS created_by,
          u.full_name AS instructor, u.esign_url AS instructor_esign,
          bslu.released_date AS released_date, bslu.returned_date AS returned_date,
          COUNT (bsli.id) as item_count
        FROM
          borrower_slip_lab AS bsl
        LEFT JOIN
          borrower_slip_lab_users AS bslu ON bsl.id = bslu.borrower_slip_id    
        LEFT JOIN
          borrower_slip_lab_items AS bsli ON bsl.id = bsli.borrower_slip_id
        LEFT JOIN
          subjects AS s ON bsl.subject_id = s.id
        LEFT JOIN
          students AS st ON bsl.borrower_id = st.id
        LEFT JOIN
          users AS u ON s.instructor_id = u.id  
        LEFT JOIN
          users AS us ON bsl.user_id = us.id 
        WHERE bsl.id = $1   
        `;

    let queryParams = [id];

    // Add grouping
    borrowerSlipQuery += ` GROUP BY 
          bsl.id,
          s.title, s.code, s.program, s.instructor_id, 
          st.full_name, st.id_number, st.e_sign,
          us.full_name,
          u.full_name, u.esign_url,
          bslu.released_date, bslu.returned_date `;

    const borrowerSlipResult = await pool.query(borrowerSlipQuery, queryParams);

    res.json(borrowerSlipResult.rows[0]);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching single lab borrower slip';
    next(err);
  }
}

/**
 * Creates a new laboratory borrower slip or returns an existing one
 *
 * @param {Object} req - Express request object with slip details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with created/found borrower slip
 */
async function createLabBorrowerSlip(req, res, next) {
  const { id: userId, laboratory: userLaboratory } = req.user;
  const { laboratory, term_sem, schoolYear } = req.body;

  try {
    // Generate unique ID for new borrower slip
    const slipId = uuidv4();

    // Define columns and values for insertion
    const columns = [
      'id',
      'laboratory',
      'term_sem',
      'school_year',
      'user_laboratory',
      'user_id',
    ];
    const values = [
      slipId,
      laboratory,
      term_sem,
      schoolYear,
      userLaboratory,
      userId,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Check if a blank borrower slip already exists for this lab and term
    const existingSlipResult = await pool.query(
      `
      SELECT id, laboratory, step 
      FROM borrower_slip_lab
      WHERE laboratory = $1 AND term_sem = $2 AND school_year = $3 AND subject_id IS NULL
      `,
      [laboratory, term_sem, schoolYear]
    );

    // Return existing slip if found
    if (existingSlipResult.rows.length > 0) {
      return res.json(existingSlipResult.rows[0]);
    }

    // Begin transaction for creating new slip
    await pool.query('BEGIN');

    // Insert new borrower slip
    const createdSlipResult = await pool.query(
      `INSERT INTO borrower_slip_lab (${columnNames}) VALUES (${placeholders}) RETURNING id, laboratory, step, subject_id`,
      values
    );

    // Create associated user record
    await pool.query(
      `INSERT INTO borrower_slip_lab_users ( borrower_slip_id ) VALUES ( $1 )`,
      [slipId]
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.json(createdSlipResult.rows[0]);
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Creating borrower slip';
    next(err);
  }
}

/**
 * Updates an existing laboratory borrower slip
 *
 * @param {Object} req - Express request object with updated details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateLabBorrowerSlip(req, res, next) {
  const { id: userId, laboratory: userLaboratory } = req.user;

  const {
    id,
    subject_id,
    borrower_id,
    college_office,
    schedule_date_of_use,
    instructor_id,
    instructor_password,
  } = req.body;

  try {
    // Verify instructor password
    const instructorData = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [instructor_id]
    );

    const isPasswordValid = bcrypt.compareSync(
      instructor_password,
      instructorData.rows[0].user_password
    );

    if (!isPasswordValid) {
      return res.status(401).send('Invalid Instructor Password');
    }

    // Define columns and values for update
    const columns = [
      'subject_id',
      'borrower_id',
      'college_office',
      'schedule_date_of_use',
      'user_laboratory',
      'user_id',
    ];

    const values = [
      subject_id,
      borrower_id,
      college_office,
      schedule_date_of_use,
      userLaboratory,
      userId,
    ];

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    values.push(id);

    // Update borrower slip
    const updateQuery = `UPDATE borrower_slip_lab SET ${setValues} WHERE id = $${values.length}`;
    await pool.query(updateQuery, values);

    res.status(200).send('Borrower slip updated successfully');
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Updating borrower slip';
    next(err);
  }
}

/**
 * Deletes a laboratory borrower slip
 *
 * @param {Object} req - Express request object with slip ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteLabBorrowerSlip(req, res, next) {
  const { full_name } = req.user;
  const { id } = req.params;

  try {
    // Delete the borrower slip
    await pool.query(`DELETE FROM borrower_slip_lab WHERE id = $1`, [id]);

    // Log deletion for audit purposes
    console.log(
      `${full_name} deleted borrower slip ${id} :: ${dateConverter()}`
    );

    res.json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Deleting borrower slip';
    next(err);
  }
}

// ============ BORROWER SLIP ITEMS ==============

/**
 * Retrieves items associated with a borrower slip
 *
 * @param {Object} req - Express request object with slip ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with borrower slip items
 */
async function getBorrowerSlipItems(req, res, next) {
  const { id } = req.params;

  try {
    // Query to get items with category information
    const borrowerItemsResult = await pool.query(
      `
      SELECT 
        bsli.*,
        stck.item_category AS item_category
      FROM
        borrower_slip_lab_items AS bsli
      LEFT JOIN
        stockcard AS stck ON bsli.stockcard_item_id = stck.id
      WHERE
        bsli.borrower_slip_id = $1
      `,
      [id]
    );

    res.json(borrowerItemsResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching borrower slip items';
    next(err);
  }
}

/**
 * Adds items to a borrower slip
 *
 * @param {Object} req - Express request object with item details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addBorrowerSlipItems(req, res, next) {
  const { user_role } = req.user;

  // Check if user has permission to add items
  if (user_role === 'Admin' || user_role === 'Dean') {
    return res.status(401).send('Unauthorized Request.');
  }

  try {
    // Extract fields that shouldn't be inserted directly into borrower_slip_lab_items
    const { remaining_balance, laboratory_name, ...itemData } = req.body;

    // Prepare columns and values for insertion
    const columns = Object.keys(itemData);
    const values = Object.values(itemData);
    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Begin transaction
    await pool.query('BEGIN');

    // Insert item into borrower_slip_lab_items
    await pool.query(
      `INSERT INTO borrower_slip_lab_items (${columnNames}) VALUES (${placeholders})`,
      values
    );

    // Extract specific fields for temporary records
    const { borrower_slip_id, stockcard_item_id, item_quantity, item_type } =
      req.body;

    // For materials, track remaining balance in temporary records
    if (item_type === 'materials') {
      const updatedBalance = Number(remaining_balance) - Number(item_quantity);

      await pool.query(
        ` INSERT INTO 
            borrower_slip_lab_temporary_records (borrower_slip_id, stockcard_item_id, remaining_balance, item_quantity, laboratory_name) 
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          borrower_slip_id,
          stockcard_item_id,
          updatedBalance,
          item_quantity,
          laboratory_name,
        ]
      );
    }

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send('Borrower slip item added successfully');
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Adding borrower slip items';
    next(err);
  }
}

/**
 * Updates a borrower slip item
 *
 * @param {Object} req - Express request object with updated item details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateLabBorrowerSlipItem(req, res, next) {
  const {
    id,
    borrower_slip_id,
    returned_status,
    item_remarks,
    item_damaged_quantity,
    stockcard_item_id,
    item_quantity,
    item_name,
    item_unit,
    released_status,
  } = req.body;

  try {
    // Update query focusing on return-related fields
    let updateQuery = ` 
      UPDATE
         borrower_slip_lab_items 
      SET
         item_remarks = $3, item_damaged_quantity = $4, returned_status = $5 
      WHERE
         id = $1 
      AND
        borrower_slip_id = $2 `;

    const queryParams = [
      id,
      borrower_slip_id,
      item_remarks,
      item_damaged_quantity,
      returned_status,
    ];

    // Note: The commented code below shows an alternative approach for updating different fields
    // if (item_quantity) {
    //   values.push(
    //     item_name,
    //     item_quantity,
    //     item_unit,
    //     stockcard_item_id,
    //     released_status
    //   );
    //   query += ` SET item_name = $3, item_quantity = $4, item_unit = $5, stockcard_item_id = $6, released_status = $7 `;
    // } else {
    //   values.push(item_remarks, returned_status);
    //   query += ` SET item_remarks = $3, returned_status = $4 `;
    // }

    await pool.query(updateQuery, queryParams);

    res.status(200).send('Borrower slip updated successfully');
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Updating borrower slip item';
    next(err);
  }
}

/**
 * Deletes an item from a borrower slip
 *
 * @param {Object} req - Express request object with item details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteBorrowerSlipItems(req, res, next) {
  const { itemId, borrowerSlipId, stockcardItemId } = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Delete the item from borrower_slip_lab_items
    await pool.query(`DELETE FROM borrower_slip_lab_items WHERE id = $1`, [
      itemId,
    ]);

    // Delete associated temporary record if exists
    await pool.query(
      `DELETE FROM borrower_slip_lab_temporary_records 
                      WHERE borrower_slip_id = $1 
                      AND stockcard_item_id = $2`,
      [borrowerSlipId, stockcardItemId]
    );

    // Commit transaction
    await pool.query('COMMIT');
    res.json();
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Deleting borrower slip items';
    next(err);
  }
}

// ========= BORROWER SLIP USERS =========

/**
 * Retrieves users associated with a borrower slip
 *
 * @param {Object} req - Express request object with slip ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with borrower slip users
 */
async function getBorrowerSlipUsers(req, res, next) {
  const { id } = req.params;

  try {
    // Query to get users with their signatures
    const borrowerUsersResult = await pool.query(
      `
      SELECT 
        u.full_name as released_by, u.esign_url AS released_esign,
        u1.full_name as checked_by, u1.esign_url AS checked_esign
      FROM 
        borrower_slip_lab_users AS bslu
      LEFT JOIN
        users AS u ON bslu.released_by = u.id 
      LEFT JOIN
        users AS u1 ON bslu.checked_by = u1.id 
      WHERE
        borrower_slip_id = $1`,
      [id]
    );

    res.json(borrowerUsersResult.rows[0]);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching borrower slip users';
    next(err);
  }
}

/**
 * Marks a borrower slip as released
 *
 * @param {Object} req - Express request object with slip details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function releaseLabBorrowerSlip(req, res, next) {
  const { id: userId, full_name } = req.user;
  const { borrowerSlipId, instructorName } = req.body;

  try {
    const currentTimestamp = new Date();

    // Begin transaction
    await pool.query('BEGIN');

    // Update borrower slip status to released (step 2)
    await pool.query(`UPDATE borrower_slip_lab SET step = 2 WHERE id = $1`, [
      borrowerSlipId,
    ]);

    // Record who released the slip and when
    await pool.query(
      `UPDATE borrower_slip_lab_users SET released_by = $2, released_date = $3 WHERE borrower_slip_id = $1`,
      [borrowerSlipId, userId, currentTimestamp]
    );

    // Update stockcard items to reflect release
    await update_stockcard_items_tru_released_borrower_slip(
      borrowerSlipId,
      instructorName,
      currentTimestamp
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.json();
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'RELEASE Borrower Slip';
    next(err);
  }
}

/**
 * Marks a borrower slip as returned
 *
 * @param {Object} req - Express request object with slip details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function returnLabBorrowerSlip(req, res, next) {
  const { id: userId, full_name } = req.user;
  const { borrowerSlipId, instructorName } = req.body;

  try {
    const currentTimestamp = new Date();

    // Begin transaction
    await pool.query('BEGIN');

    // Update borrower slip status to returned (step 3)
    await pool.query(`UPDATE borrower_slip_lab SET step = 3 WHERE id = $1`, [
      borrowerSlipId,
    ]);

    // Record who checked the return and when
    await pool.query(
      `UPDATE borrower_slip_lab_users SET checked_by = $2, returned_date = $3 WHERE borrower_slip_id = $1`,
      [borrowerSlipId, userId, currentTimestamp]
    );

    // Update stockcard items to reflect return
    await update_stockcard_items_tru_returned_borrower_slip(
      borrowerSlipId,
      instructorName,
      currentTimestamp
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.json();
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'RETURNED Borrower slip';
    next(err);
  }
}

exports.getPaginatedLabBorrowerSlips = getPaginatedLabBorrowerSlips;
exports.getSingleLabBorrowerSlip = getSingleLabBorrowerSlip;
exports.createLabBorrowerSlip = createLabBorrowerSlip;
exports.updateLabBorrowerSlip = updateLabBorrowerSlip;
exports.deleteLabBorrowerSlip = deleteLabBorrowerSlip;

exports.getBorrowerSlipItems = getBorrowerSlipItems;
exports.addBorrowerSlipItems = addBorrowerSlipItems;
exports.updateLabBorrowerSlipItem = updateLabBorrowerSlipItem;
exports.deleteBorrowerSlipItems = deleteBorrowerSlipItems;

exports.getBorrowerSlipUsers = getBorrowerSlipUsers;
exports.releaseLabBorrowerSlip = releaseLabBorrowerSlip;
exports.returnLabBorrowerSlip = returnLabBorrowerSlip;
