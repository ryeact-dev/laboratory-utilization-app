const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dbActiveSchoolYear } = require('../util/dbActiveSchoolYear');

/**
 * Retrieves a list of all school years
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of school years
 */
async function getSchoolYearList(req, res, next) {
  try {
    // Query to get all school years ordered by school year
    const result = await pool.query(
      'SELECT * FROM schoolyear ORDER BY school_year',
      []
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching school year list';
    next(err);
  }
}

/**
 * Retrieves the currently active school year
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the active school year
 */
async function getActiveSchoolYear(req, res, next) {
  try {
    // Get active school year information
    const { school_year } = await dbActiveSchoolYear();

    res.json(school_year);
  } catch (err) {
    err.title = 'Fetching active school year';
    next(err);
  }
}

/**
 * Retrieves the currently active term and semester
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the active term and semester
 */
async function getActiveTermSem(req, res, next) {
  try {
    // Get active school year information
    const { school_year } = await dbActiveSchoolYear();

    // Query to get active term and semester for the current school year
    const result = await pool.query(
      'SELECT * FROM term_sem WHERE termsem_is_active = $1 AND school_year = $2',
      [true, school_year]
    );

    res.json(result.rows[0]);
  } catch (err) {
    err.title = 'Fetching active term and sem';
    next(err);
  }
}

/**
 * Retrieves a list of terms and semesters for the active school year
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of terms and semesters
 */
async function getTermSemList(req, res, next) {
  try {
    // Get active school year information
    const { school_year } = await dbActiveSchoolYear();

    // Query to get all terms and semesters for the active school year
    const result = await pool.query(
      'SELECT * FROM term_sem WHERE school_year = $1',
      [school_year]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching term and sem list';
    next(err);
  }
}

/**
 * Retrieves the dates for the selected term and semester
 *
 * @param {Object} req - Express request object with selected term and active school year
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the dates for the selected term and semester
 */
async function getSelectedTermSemDates(req, res, next) {
  const { selectedTermAndSem, activeSchoolYear } = req.body;

  const firstSem = ['1st Term - 1st Sem', '2nd Term - 1st Sem'];
  const secondSem = ['1st Term - 2nd Sem', '2nd Term - 2nd Sem'];
  let activeSem = ['Summer'];

  let schoolYear = activeSchoolYear;

  try {
    // If no active school year is provided, fetch the current active school year
    if (!activeSchoolYear) {
      const { school_year } = await dbActiveSchoolYear();
      schoolYear = school_year;
    }

    // Determine the active semester based on the selected term
    if (firstSem.includes(selectedTermAndSem)) {
      activeSem = firstSem;
    }
    if (secondSem.includes(selectedTermAndSem)) {
      activeSem = secondSem;
    }

    // Query to get the starting and ending dates for the selected term and semester
    const result = await pool.query(
      `
        SELECT 
          starting_date, ending_date, termsem_is_active, term_sem 
        FROM 
          term_sem 
        WHERE
          term_sem = ANY($1) 
        AND
          school_year = $2
        ORDER BY
          starting_date  
      `,
      [activeSem, schoolYear]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching term and sem dates';
    next(err);
  }
}

/**
 * Retrieves the active semester dates
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the active semester dates
 */
async function getActiveSemestralDate(req, res, next) {
  try {
    const firstSem = ['1st Term - 1st Sem', '2nd Term - 1st Sem'];
    const secondSem = ['1st Term - 2nd Sem', '2nd Term - 2nd Sem'];
    let activeSem = ['Summer'];

    await pool.query('BEGIN');
    // Query to get the currently active term and semester
    const result = await pool.query(
      'SELECT * FROM term_sem WHERE termsem_is_active = $1',
      [true]
    );

    const activeTermSem = result.rows[0].term_sem;

    // Determine the active semester based on the current active term
    if (firstSem.includes(activeTermSem)) {
      activeSem = firstSem;
    }
    if (secondSem.includes(activeTermSem)) {
      activeSem = secondSem;
    }

    // Query to get the dates for the active semester
    const semestralDate = await pool.query(
      `SELECT * FROM term_sem WHERE term_sem = ANY($1) ORDER BY id`,
      [activeSem]
    );
    await pool.query('COMMIT');

    res.json(semestralDate.rows);
  } catch (err) {
    await pool.query('ROLLBACK');
    err.title = 'Fetching active term and sem';
    next(err);
  }
}

/**
 * Sets the starting and ending dates for a term and semester
 *
 * @param {Object} req - Express request object with term and semester details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function setTermSemDates(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can set term and semester dates
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const { termSemId, whatTermSem, startDate, endingDate } = req.body;

  try {
    const { school_year: activeSchoolYear } = await dbActiveSchoolYear();

    // Check if the term and semester already exists for the active school year
    const termSemExists = await pool.query(
      'SELECT id FROM term_sem WHERE term_sem = $1 AND school_year = $2',
      [whatTermSem, activeSchoolYear]
    );

    if (termSemExists.rows.length > 0) {
      // If term and semester already exists, update the dates
      await pool.query(
        'UPDATE term_sem SET starting_date = $1, ending_date = $2 WHERE id = $3 AND term_sem = $4',
        [startDate, endingDate, termSemId, whatTermSem]
      );
    } else {
      // If term and semester does not exist, insert the new dates
      await pool.query(
        'INSERT INTO term_sem (term_sem, starting_date, ending_date, termsem_is_active, school_year) VALUES ($1, $2, $3, $4, $5)',
        [whatTermSem, startDate, endingDate, false, activeSchoolYear]
      );
    }

    res.json();
  } catch (err) {
    err.title = 'Updating term and sem dates';
    next(err);
  }
}

/**
 * Sets the starting and ending dates for the school year
 *
 * @param {Object} req - Express request object with school year details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function setSemDates(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can set school year dates
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const { schoolYearId, selectedSchoolYear, startDate, endingDate } = req.body;

  try {
    // Update the starting and ending dates for the specified school year
    await pool.query(
      'UPDATE schoolyear SET starting_date = $1, ending_date = $2 WHERE id = $3 AND school_year = $4',
      [startDate, endingDate, schoolYearId, selectedSchoolYear]
    );
    res.json();
  } catch (err) {
    err.title = 'Update semestral dates';
    next(err);
  }
}

/**
 * Sets the active term and semester
 *
 * @param {Object} req - Express request object with term and semester details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the activated term and semester
 */
async function setActiveTermSem(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can set active term and semester
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const { termSemId, whatTermSem } = req.body;

  try {
    // Activate the specified term and semester
    const activatedTermAndSem = await pool.query(
      'UPDATE term_sem SET termsem_is_active = $1 WHERE id = $2 AND term_sem = $3 RETURNING term_sem, starting_date, ending_date ',
      [true, termSemId, whatTermSem]
    );

    // Deactivate all other terms and semesters
    await pool.query(
      'UPDATE term_sem SET termsem_is_active = $1 WHERE id != $2 AND term_sem != $3',
      [false, termSemId, whatTermSem]
    );

    res.json(activatedTermAndSem.rows[0]);
  } catch (err) {
    err.title = 'Setting active term and sem';
    next(err);
  }
}

/**
 * Sets the active school year
 *
 * @param {Object} req - Express request object with school year details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the activated school year
 */
async function setActiveSchoolYear(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can set active school year
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const { schoolYearId } = req.body;

  try {
    // Activate the specified school year
    const activatedSchoolYear = await pool.query(
      'UPDATE schoolyear SET sy_is_active = $1 WHERE id = $2 RETURNING id, school_year, sy_is_active',
      [true, schoolYearId]
    );

    // Deactivate all other school years
    await pool.query('UPDATE schoolyear SET sy_is_active = $1 WHERE id != $2', [
      false,
      schoolYearId,
    ]);

    res.json(activatedSchoolYear.rows[0]);
  } catch (err) {
    err.title = 'Setting active school year';
    next(err);
  }
}

/**
 * Adds a new school year to the database
 *
 * @param {Object} req - Express request object with school year details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addSchoolYear(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can add school years
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const schoolYear = `SY ${req.body.schoolYear}`;

  try {
    const id = uuidv4();

    // Check if the school year already exists
    const result = await pool.query(
      'SELECT * FROM schoolyear WHERE school_year = $1',
      [schoolYear]
    );

    if (result.rows.length > 0)
      return res.status(409).send('Entered School-Year is already exists!');

    // Insert the new school year into the database
    await pool.query(
      'INSERT INTO schoolyear (id, school_year, sy_is_active) VALUES ($1, $2, $3)',
      [id, schoolYear, false]
    );

    res.json();
  } catch (err) {
    err.title = 'Adding school year';
    next(err);
  }
}

/**
 * Removes a school year from the database
 *
 * @param {Object} req - Express request object with school year details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function removeSchoolYear(req, res, next) {
  const { user_role } = req.user;

  // Only Admin can remove school years
  if (user_role !== 'Admin')
    return res
      .status(401)
      .send('You are not authorized to perform this action');

  const schoolYear = `SY ${req.body.schoolYear}`;

  try {
    // Delete the specified school year from the database
    await pool.query('DELETE FROM schoolyear WHERE school_year = $1', [
      schoolYear,
    ]);
    res.json();
  } catch (err) {
    err.title = 'Deleting school year';
    next(err);
  }
}

exports.getSchoolYearList = getSchoolYearList;
exports.getActiveSchoolYear = getActiveSchoolYear;
exports.getTermSemList = getTermSemList;
exports.getActiveTermSem = getActiveTermSem;
exports.getSelectedTermSemDates = getSelectedTermSemDates;
exports.getActiveSemestralDate = getActiveSemestralDate;
exports.setTermSemDates = setTermSemDates;
exports.setSemDates = setSemDates;
exports.setActiveTermSem = setActiveTermSem;
exports.setActiveSchoolYear = setActiveSchoolYear;
exports.addSchoolYear = addSchoolYear;
exports.removeSchoolYear = removeSchoolYear;
