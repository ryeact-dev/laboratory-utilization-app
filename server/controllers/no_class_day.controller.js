const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');

/**
 * Retrieves all no-class days for a specific school year
 *
 * @param {Object} req - Express request object containing schoolyear and termsem in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with list of no-class days
 */
async function getListOfHolidays(req, res, next) {
  const { schoolyear, termsem } = req.query;

  try {
    // Query database for all no-class days in the specified school year
    const noClassDaysResult = await pool.query(
      'SELECT * FROM no_class_days WHERE school_year = $1 ORDER BY no_class_date',
      [schoolyear]
    );
    return res.json(noClassDaysResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching no-class days list';
    next(err);
  }
}

/**
 * Adds a new no-class day to the database
 *
 * @param {Object} req - Express request object with no-class day details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or conflict error
 */
async function addNoClassDay(req, res, next) {
  const {
    activeSchoolYear,
    activeTermSem,
    schedule, // Type of schedule (e.g., regular, special)
    title, // Description of the no-class day
    noClassDate, // Date when classes are suspended
  } = req.body;

  try {
    // Generate unique identifier for the new record
    const recordId = uuidv4();
    const creationTimestamp = new Date();

    // Convert and normalize the date
    const formattedDate = new Date(noClassDate);

    // Check if this date already exists in the database
    const existingDateResult = await pool.query(
      'SELECT no_class_date FROM no_class_days WHERE no_class_date = $1',
      [formattedDate]
    );

    // Return conflict error if date already exists
    if (existingDateResult.rows.length > 0) {
      return res.status(409).send('Date already exist');
    }

    // Insert the new no-class day record
    await pool.query(
      'INSERT INTO no_class_days (id, no_class_date, title, school_year, term_sem, type_of_schedule, created_at) VALUES ( $1, $2, $3, $4, $5, $6, $7 )',
      [
        recordId,
        formattedDate,
        title,
        activeSchoolYear,
        activeTermSem,
        schedule,
        creationTimestamp,
      ]
    );

    res.status(200).send('Date has been added');
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Adding no-class day on list';
    next(err);
  }
}

/**
 * Deletes a no-class day from the database
 *
 * @param {Object} req - Express request object with listId in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteNoClassDay(req, res, next) {
  const { listId } = req.params;

  try {
    // Remove the specified no-class day record
    await pool.query(`DELETE FROM no_class_days WHERE id = $1`, [listId]);
    res.json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Deleting no-class day on list';
    next(err);
  }
}

exports.getListOfHolidays = getListOfHolidays;
exports.addNoClassDay = addNoClassDay;
exports.deleteNoClassDay = deleteNoClassDay;
