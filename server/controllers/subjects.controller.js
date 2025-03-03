const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');
const { logger } = require('../util/winstonLogger');
const chalk = require('chalk');

/**
 * Retrieves subjects for a specific school year
 *
 * @param {Object} req - Express request object with school year in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with subjects for the specified school year
 */
async function getSchoolYearSubjects(req, res, next) {
  const { schoolyear } = req.query;

  try {
    // Query to get all subjects for the specified school year
    const result = await pool.query(
      'SELECT * FROM subjects WHERE school_year = $1',
      [schoolyear]
    );
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching subjects';
    next(err);
  }
}

/**
 * Retrieves a paginated list of subjects
 *
 * @param {Object} req - Express request object with pagination parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated subjects and pagination info
 */
async function getPaginatedSubjects(req, res, next) {
  const { laboratory } = req.user;
  const checkLaboratory = laboratory.filter((lab) => lab !== '');

  const {
    activeSchoolYear,
    selectedTermAndSem,
    subjectCode,
    perpage,
    isSemestral,
  } = req.body;

  const whatSem = isSemestral
    ? selectedTermAndSem
    : selectedTermAndSem?.split(' - ')[1];

  let { page } = req.body;

  let termSemArray = [];

  // Ensure page is not negative
  if (page < 0) page = 0;

  // Determine term and semester based on selection
  if (selectedTermAndSem === 'Summer') {
    termSemArray = ['Summer'];
  } else if (whatSem === '1st Sem' || whatSem === 'First Semester') {
    termSemArray = ['1st Term - 1st Sem', '2nd Term - 1st Sem'];
  } else {
    termSemArray = ['1st Term - 2nd Sem', '2nd Term - 2nd Sem'];
  }

  try {
    const parsedPerPage = Number(perpage);

    const values = [
      activeSchoolYear,
      termSemArray,
      subjectCode,
      parsedPerPage,
      page * parsedPerPage,
    ];

    // Base query to get subjects with filtering
    let query = `
        SELECT 
          s.id, s.code, s.title, s.instructor_id, s.program, s.start_time, s.end_time, s.students, s.term_sem, s.schedule, s.user_laboratory,
          u.full_name AS instructor_name, u.department
        FROM
          subjects AS s
        LEFT JOIN
          users u ON s.instructor_id = u.id
        WHERE 
          s.school_year = $1 AND s.term_sem = ANY($2) AND s.code LIKE $3 || '%' `;

    // Add laboratory filter if applicable
    if (checkLaboratory.length > 0) {
      query += 'AND s.user_laboratory && $6 ';
      values.push(checkLaboratory);
    }

    // Add pagination to the query
    query += 'ORDER BY code LIMIT $4 OFFSET $5';

    // Execute the query to get subjects
    const result = await pool.query(query, values);
    const hasMore = result.rows.length === Number(perpage);

    res.json({ subjects: result.rows, hasMore });
  } catch (err) {
    err.title = 'Fetching paginated list of subjects';
    next(err);
  }
}

/**
 * Retrieves a single subject's details
 *
 * @param {Object} req - Express request object with subject code, ID, and school year in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with subject details
 */
async function getSingleSubject(req, res, next) {
  const { code, id, schoolyear } = req.query;

  try {
    // Query to get subject details by code or ID
    const result = await pool.query(
      `SELECT 
        s.*, u.full_name AS instructor
       FROM
        subjects AS s 
       INNER JOIN
        users u ON s.instructor_id = u.id
       WHERE 
        s.school_year = $1 AND (s.code = $2 OR s.id = $3)`,
      [schoolyear, code, id]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching single subject';
    next(err);
  }
}

/**
 * Deletes a subject from the database
 *
 * @param {Object} req - Express request object with subject ID in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteSubject(req, res, next) {
  const { user_role } = req.user;

  // Check if the user has permission to delete subjects
  if (
    user_role !== 'Custodian' &&
    user_role !== 'Admin' &&
    user_role !== 'STA'
  ) {
    return res.status(401).send('Unauthorized Request.');
  }

  const { subjectId, currentUserName } = req.body;

  try {
    // Delete the subject and return the deleted record
    const result = await pool.query(
      `DELETE FROM subjects WHERE id = $1 RETURNING *`,
      [subjectId]
    );
    const subjectCode = result.rows[0].code;
    logger.info(
      chalk.blue(
        `Subject with code ${subjectCode} has been successfully removed from database by
        ${currentUserName} dated :: ${dateConverter()}`
      )
    );
    res.json();
  } catch (err) {
    // Handle foreign key constraint errors
    if (err.constraint) {
      return res
        .status(403)
        .send('Cannot remove a subject with utilization or schedule records');
    }
    err.title = 'Deleting subject';
    next(err);
  }
}

/**
 * Registers a new subject in the database
 *
 * @param {Object} req - Express request object with subject details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addSubject(req, res, next) {
  const { user_role, laboratory, branch } = req.user;

  // Check if the user has permission to add subjects
  if (user_role !== 'Custodian' && user_role !== 'STA') {
    return res.status(401).send('Unauthorized Request.');
  }

  const {
    code,
    title,
    description,
    instructor_id,
    start_time,
    end_time,
    schedule,
    term_sem,
    school_year,
    program,
    user,
  } = req.body;

  try {
    // Check for duplicate subject code in the same term and school year
    const result = await pool.query(
      'SELECT * FROM subjects WHERE term_sem = $1 AND code = $2 AND school_year = $3',
      [term_sem, code, school_year]
    );

    const fetchSubject = result.rows[0];

    if (fetchSubject)
      return res.status(409).send(`Duplicate Subject Code for ${term_sem}`);

    const students = []; // Initialize an empty array for students

    // Generate a unique ID for the new subject
    const id = uuidv4();
    const createdAt = new Date();

    // Prepare columns and values for insertion
    const columns = [
      'id',
      'code',
      'title',
      'description',
      'instructor_id',
      'start_time',
      'end_time',
      'schedule',
      'term_sem',
      'program',
      'students',
      'user_laboratory',
      'school_year',
      'branch',
      'created_at',
    ];

    const values = [
      id,
      code,
      title,
      description,
      instructor_id,
      start_time,
      end_time,
      schedule,
      term_sem,
      program,
      students,
      laboratory,
      school_year,
      branch,
      createdAt,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new subject into the database
    const query = `INSERT INTO subjects (${columnNames}) VALUES (${placeholders})`;
    await pool.query(query, values);

    res.status(200).send(`${code}-${title} updated successfully`);
    logger.info(
      chalk.blue(
        `Subject: ${title} with code ${code} successfully added by ${user}`
      )
    );
  } catch (err) {
    err.title = 'Adding new subject';
    next(err);
  }
}

/**
 * Updates an existing subject's information
 *
 * @param {Object} req - Express request object with updated subject details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateSubject(req, res, next) {
  const { user_role, laboratory } = req.user;

  // Check if the user has permission to update subjects
  if (
    user_role !== 'Custodian' &&
    user_role !== 'Admin' &&
    user_role !== 'STA'
  ) {
    return res.status(401).send('Unauthorized Request.');
  }

  const {
    id,
    code,
    title,
    description,
    instructor_id,
    start_time,
    end_time,
    schedule,
    term_sem,
    program,
    user,
    school_year,
  } = req.body;

  // const { isConflict, updatedSchedStartTime, updatedSchedEndTime, noSchedule } =
  //   await checkConflictSubject(
  //     id,
  //     term_sem,
  //     school_year,
  //     schedule,
  //     start_time,
  //     end_time,
  //     next
  //   );

  // if (isConflict) {
  //   return res
  //     .status(409)
  //     .send(
  //       'Schedule conflict with another subject, Please check the schedule'
  //     );
  // }

  // const scheduleMap = {
  //   0: selected_day.join(','), // Joins the array strings with commas ie. "MO,TU,WE,TH,FR"
  //   3: 'MO,TU,WE,TH,FR',
  // };
  // recurrenceRule = scheduleMap[schedule];

  try {
    let recurrenceRule = [];

    // Check if the subject has an existing schedule
    const result = await pool.query(
      'SELECT recurrence_rule FROM schedules WHERE subject_id = $1',
      [id]
    );

    const hasSchedule = result.rows.length === 0 ? true : false;

    if (!hasSchedule) {
      recurrenceRule = result.rows[0].recurrence_rule;
    }

    // Prepare columns and values for update
    const columns = [
      'code',
      'title',
      'description',
      'instructor_id',
      'start_time',
      'end_time',
      'schedule',
      'term_sem',
      'program',
    ];
    const values = [
      code,
      title,
      description,
      instructor_id,
      start_time,
      end_time,
      schedule,
      term_sem,
      program,
      id,
    ];

    const scheduleColumns = [
      'class_schedule',
      'recurrence_rule',
      'sched_start_time',
      'sched_end_time',
    ];
    const scheduleValues = [schedule, recurrenceRule, start_time, end_time, id];

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    const setScheduleValues = scheduleColumns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    const query = `UPDATE subjects SET ${setValues} WHERE id = $10`;
    // IF THE USER CHANGE THE CLASS SCHEDULE THEN LABORATORY CLASS SCHEDULE WILL ALSO BE UPDATED
    const scheduleQuery = `UPDATE schedules SET ${setScheduleValues} WHERE subject_id = $5 AND is_regular_class = TRUE`;

    // TODO: If the subject teacher was updated then instructor weekly usage will be updated too
    // const instructorWeeklyUsageQuery = `UPDATE instructor_weekly_usage SET subject_id = $5 WHERE subject_id = $5`;

    // Execute the update queries
    await pool.query(query, values);
    // Activate the schedule query only when the subject was already scheduled
    hasSchedule && (await pool.query(scheduleQuery, scheduleValues));

    res.status(200).send(`${code}-${title} updated successfully`);
    logger.info(
      chalk.blue(
        `Subject: ${code}-${title} successfully updated by ${user} ${dateConverter()}`
      )
    );
  } catch (err) {
    err.title = 'Updating subject';
    next(err);
  }
}

/**
 * Adds a student to a subject's class list
 *
 * @param {Object} req - Express request object with student ID and subject ID in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addClasslistStudent(req, res, next) {
  const { studentId, subjectId } = req.body;

  try {
    // Check if the student is already in the class list
    const result = await pool.query(
      'SELECT * FROM subjects WHERE id = $1 AND students @> ARRAY[$2]',
      [subjectId, studentId]
    );

    const fetchSubject = result.rows[0];

    if (fetchSubject) return res.status(409).send(`Student already exists`);

    // Add the student to the subject's class list
    const values = [studentId, subjectId];
    const query = `UPDATE subjects SET students = array_append(students, $1) WHERE id = $2`;

    await pool.query(query, values);
    res.json();
  } catch (err) {
    err.title = 'Adding student in a classlist';
    next(err);
  }
}

/**
 * Removes all students from a subject's class list
 *
 * @param {Object} req - Express request object with updated class list and subject ID in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function removeClasslitStudent(req, res, next) {
  const { updatedClasslist = [], subjectId } = req.body;

  // Convert JS array to PostgreSQL array format
  const updatedClasslistPG =
    updatedClasslist.length > 0 ? `{${updatedClasslist.join(',')}}` : [];

  try {
    const values = [updatedClasslistPG, subjectId];
    const query = `UPDATE subjects SET students = $1 WHERE id = $2`;

    await pool.query(query, values);
    res.json();
  } catch (err) {
    err.title = 'Removing student/s in a classlist';
    next(err);
  }
}

/**
 * Batch uploads students into a subject's class list from an array of ID numbers
 *
 * @param {Object} req - Express request object with ID numbers and subject ID in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addBulkClasslistStudents(req, res) {
  const { idNumbers, subjectId } = req.body;

  try {
    // Retrieve student IDs from the database based on provided ID numbers
    const result = await pool.query(
      'SELECT id FROM students WHERE id_number = ANY($1) ORDER BY full_name',
      [idNumbers]
    );

    // Convert JS array to PostgreSQL array format
    const foundStudents = result.rows.map((row) => row.id);
    const convertedArray = `{${foundStudents.join(',')}}`;

    const values = [convertedArray, subjectId];
    const query = `UPDATE subjects SET students = $1 WHERE id = $2`;

    await pool.query(query, values);
    res.json();
  } catch (err) {
    err.title = 'Adding bulk students in a classlist';
    next(err);
  }
}

exports.getSchoolYearSubjects = getSchoolYearSubjects;
exports.getPaginatedSubjects = getPaginatedSubjects;
exports.getSingleSubject = getSingleSubject;
exports.deleteSubject = deleteSubject;
exports.addSubject = addSubject;
exports.updateSubject = updateSubject;
exports.addClasslistStudent = addClasslistStudent;
exports.removeClasslitStudent = removeClasslitStudent;
exports.addBulkClasslistStudents = addBulkClasslistStudents;
