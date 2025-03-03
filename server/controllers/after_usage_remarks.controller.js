const pool = require('../config/db.config');

/**
 * Retrieves remarks for a specific utilization/usage
 *
 * @param {Object} req - Express request object with usageid in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with remarks for the specified usage
 */
async function getSubjectRemarks(req, res, next) {
  const { usageid } = req.query;

  try {
    // Query to get remarks with usage date for a specific utilization
    const remarksQuery = `
      SELECT 
        r.*, u.usage_date
      FROM 
        remarks r
      INNER JOIN 
        utilizations u ON r.utilization_id = u.id
      WHERE r.utilization_id = $1
      `;

    const remarksResult = await pool.query(remarksQuery, [usageid]);

    res.json(remarksResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching subject remarks';
    next(err);
  }
}

/**
 * Retrieves all remarks across all utilizations
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with all remarks
 */
async function getAllRemarks(req, res, next) {
  try {
    // Query to get all remarks with their corresponding usage dates
    const allRemarksQuery = `
    SELECT 
      r.*, u.usage_date
    FROM 
      remarks r
    INNER JOIN 
      utilizations u ON r.utilization_id = u.id
    `;

    const allRemarksResult = await pool.query(allRemarksQuery, []);
    res.json(allRemarksResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching all remarks';
    next(err);
  }
}

/**
 * Adds a new remark for a utilization
 *
 * @param {Object} req - Express request object with remark details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addUtilizationRemarks(req, res, next) {
  const {
    remark, // The main remark text
    unit_no = 0, // Unit number (defaults to 0 if not provided)
    description, // Detailed description of the issue
    usageId, // ID of the utilization this remark belongs to
    usageDate, // Date of the utilization
    ticket_no, // Reference ticket number if applicable
  } = req.body;

  try {
    // Define database columns and corresponding values
    const dbColumns = [
      'utilization_id',
      'remark',
      'unit_number',
      'problem',
      'ticket_no',
      'created_at',
    ];

    const dbValues = [
      usageId,
      remark,
      unit_no,
      description,
      ticket_no,
      usageDate,
    ];

    // Prepare the SQL query dynamically
    const columnNames = dbColumns.join(', ');
    const placeholders = dbColumns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new remark into the database
    await pool.query(
      `INSERT INTO remarks (${columnNames}) VALUES (${placeholders})`,
      dbValues
    );

    res.json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Adding utilization remarks';
    next(err);
  }
}

/**
 * Deletes a specific remark
 *
 * @param {Object} req - Express request object with remarkId in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteUtilizationRemark(req, res, next) {
  const { remarkId } = req.body;

  try {
    // Remove the specified remark from the database
    await pool.query(`DELETE FROM remarks WHERE id = $1`, [remarkId]);
    res.json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Deleting utilization remarks';
    next(err);
  }
}

exports.getSubjectRemarks = getSubjectRemarks;
exports.getAllRemarks = getAllRemarks;
exports.addUtilizationRemarks = addUtilizationRemarks;
exports.deleteUtilizationRemark = deleteUtilizationRemark;
