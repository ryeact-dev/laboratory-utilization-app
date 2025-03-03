const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');
const { logger } = require('../util/winstonLogger');
const chalk = require('chalk');
const { verifyLaboratories } = require('../util/verifyLaboratories');
const { monthDiff } = require('../util/dateHelpers');
const { CAN_ACKNOWLEDGE_USERS } = require('../util/userRoleStep');

/**
 * Retrieves previous week usage data for a specific subject
 *
 * @param {Object} req - Express request object with subject code, title, and base date
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with total hours of previous usage and semester information
 */
async function getPrevUtilizations(req, res, next) {
  const { subjectcode, subjecttitle, basedate } = req.query;

  try {
    // Query to get all previous utilizations for the subject before the base date
    const result = await pool.query(
      `
      SELECT
          s.code, s.title, s.term_sem,
          u.usage_date, u.usage_hours
      FROM
          subjects s
      INNER JOIN
          utilizations u ON s.id = u.subject_id
      WHERE
          s.code = $1 AND s.title = $2 AND u.usage_date < TO_DATE($3, 'YYYY-MM-DD')
      `,
      [subjectcode, subjecttitle, basedate]
    );

    // Calculate total hours of previous usage
    const totalHoursOfPreviousUsage = result.rows.reduce(
      (total, currenValue) => {
        return total + currenValue.usage_hours;
      },
      0
    );

    // Check if the subject is in 1st or 2nd term
    const terms = result.rows.reduce(
      (acc, row) => {
        if (row.term_sem.trim().includes('1st Term')) acc.isFirstTerm = true;
        if (row.term_sem.trim().includes('2nd Term')) acc.isSecondTerm = true;
        return acc;
      },
      { isFirstTerm: false, isSecondTerm: false }
    );

    const { isFirstTerm, isSecondTerm } = terms;

    // Determine if the subject is semestral (spans both terms)
    const isSemestral = isFirstTerm && isSecondTerm;

    res.json({ isSemestral, totalHoursOfPreviousUsage });
  } catch (err) {
    err.title = 'Fetching previuos utilizations';
    next(err);
  }
}

/**
 * Retrieves utilization details with associated schedule information
 *
 * @param {Object} req - Express request object with usage ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with utilization and schedule details
 */
async function getUtilizationWithScheduleId(req, res, next) {
  const { usage_id } = req.query;

  try {
    // Query to get utilization with associated laboratory information
    const result = await pool.query(
      `
      SELECT 
          u.*, 
          sc.laboratory 
      FROM 
          utilizations u 
      INNER JOIN 
          schedules sc ON u.schedule_id = sc.id 
      WHERE 
          u.id = $1
      `,
      [usage_id]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching utilization with schedule id';
    next(err);
  }
}

/**
 * Retrieves laboratory utilizations based on laboratory, term/semester, class schedule, and school year
 *
 * @param {Object} req - Express request object with filtering parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with laboratory utilization records
 */
async function getLaboratoryUtilizations(req, res, next) {
  const { laboratory, seletedClassSchedule, scheduledIds } = req.body;

  // TODO: IF ULITIZATION HAS BUGGED. I HAVE ADDED THE SCHOOL YEAR IN QUERY

  try {
    // Query to get laboratory utilizations with filtering
    const result = await pool.query(
      `
      SELECT 
        u.id, u.end_time, u.start_time, u.schedule_id, u.subject_id, u.usage_date, u.usage_hours,
        sc.sched_end_time, sc.class_schedule, sc.is_regular_class
      FROM 
        utilizations u
      INNER JOIN 
        subjects s ON u.subject_id = s.id 
      INNER JOIN 
        schedules sc ON u.schedule_id = sc.id 
      WHERE 
        sc.laboratory = $1 
        AND sc.id = ANY($2)
        AND sc.sched_status = 2 
        AND (sc.class_schedule = $3 OR sc.class_schedule = 3 OR $3 = 0)
      `,
      [laboratory, scheduledIds, seletedClassSchedule]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching laboratory utilizations';
    next(err);
  }
}

/**
 * Retrieves utilizations for a specific term with various filtering options
 *
 * @param {Object} req - Express request object with filtering parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with term utilization records
 */
async function getTermUtilizations(req, res, next) {
  const { user_program: program, user_role: userRole, id: userId } = req.user;

  const {
    laboratory,
    schoolyear,
    termsem,
    subjectid,
    class_schedule,
    selected_date,
  } = req.query;

  // Verify if user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request');

  try {
    // TODO: THIS CODE WILL BE USED ALSO BY DASHBOARD DATA
    // TODO: THIS CODE NEEDS TO BE OPTIMIZED. WHETHER AGGREGATE THE DATE HERE BEFORE RETURNING THE DATA

    // Base query to get term utilizations with filtering
    let query = `
        SELECT 
          u.id, u.schedule_id, u.start_time, u.end_time, u.usage_hours, u.usage_date, 
          sc.sched_start_time, sc.sched_end_time, sc.class_schedule, sc.is_regular_class, sc.subject_id, sc.recurrence_rule,
          s.code, s.title, s.program, s.term_sem, us.full_name AS instructor
        FROM 
          schedules sc 
        INNER JOIN 
          subjects s ON sc.subject_id = s.id AND s.school_year = $1
        LEFT JOIN 
          users us ON s.instructor_id = us.id
        LEFT JOIN 
          utilizations u ON sc.id = u.schedule_id
        WHERE 
          sc.laboratory = $2 AND 
          s.term_sem = $3 AND 
          (sc.class_schedule = $4 OR $4 = 0) AND 
          (u.usage_date IS NULL OR u.usage_date <= TO_DATE($5::text, 'YYYY-MM-DD'))
        `;

    const queryParams = [
      schoolyear,
      laboratory,
      termsem,
      class_schedule,
      selected_date,
    ];

    // Add role-specific filtering conditions
    if (userRole === 'Program Head') {
      if (subjectid !== 'undefined') {
        query +=
          ' AND u.subject_id = $6 AND (s.program = $7 OR s.instructor_id = $8)';
        queryParams.push(subjectid, program, userId);
      } else {
        query += ' AND (s.program = $6 OR s.instructor_id = $7)';
        queryParams.push(program, userId);
      }
    } else if (userRole === 'Faculty') {
      if (subjectid !== 'undefined') {
        query += ' AND u.subject_id = $6 AND s.instructor_id = $7';
        queryParams.push(subjectid, userId);
      } else {
        query += ' AND s.instructor_id = $6';
        queryParams.push(userId);
      }
    } else if (subjectid !== 'undefined') {
      query += ' AND u.subject_id = $6';
      queryParams.push(subjectid);
    }

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching term utilizations';
    next(err);
  }
}

/**
 * Retrieves weekly laboratory utilizations with various filtering options
 *
 * @param {Object} req - Express request object with filtering parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with weekly laboratory utilization records
 */
async function getLaboratoryWeeklyUtilizations(req, res, next) {
  const { user_program: program, user_role: userRole, id: userId } = req.user;

  const {
    laboratory,
    schoolyear,
    termsem,
    subjectid,
    class_schedule,
    selected_date,
  } = req.query;

  // Verify if user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request');

  try {
    // Base query to get weekly laboratory utilizations with filtering
    let query = `
        SELECT 
          u.id, u.usage_hours, u.usage_date, 
          s.code, s.title, s.program, s.term_sem, 
          s.id AS subject_id, sc.is_regular_class,
          us.full_name AS instructor
        FROM 
          utilizations u 
        INNER JOIN 
          schedules sc ON u.schedule_id = sc.id
        INNER JOIN 
          subjects s ON sc.subject_id = s.id AND s.school_year = $1
        INNER JOIN 
          users us ON s.instructor_id = us.id
        WHERE 
          sc.laboratory = $2 AND 
          s.term_sem = $3 AND 
          (sc.class_schedule = $4 OR $4 = 0) AND 
          (u.usage_date IS NULL OR u.usage_date <= TO_DATE($5::text, 'YYYY-MM-DD'))
        `;

    const queryParams = [
      schoolyear,
      laboratory,
      termsem,
      class_schedule,
      selected_date,
    ];

    // Add role-specific filtering conditions
    if (userRole === 'Program Head') {
      if (subjectid !== 'undefined') {
        query += ' AND u.subject_id = $6 AND s.program = $7';
        queryParams.push(subjectid, program);
      } else {
        query += ' AND s.program = $6';
        queryParams.push(program);
      }
    } else if (userRole === 'Faculty') {
      if (subjectid !== 'undefined') {
        query += ' AND u.subject_id = $6 AND s.instructor_id = $7';
        queryParams.push(subjectid, userId);
      } else {
        query += ' AND s.instructor_id = $6';
        queryParams.push(userId);
      }
    } else if (subjectid !== 'undefined') {
      query += ' AND u.subject_id = $6';
      queryParams.push(subjectid);
    }

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching Laboratory weekly utilizations';
    next(err);
  }
}

/**
 * Retrieves utilizations for specific week dates
 *
 * @param {Object} req - Express request object with week dates and filtering parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with weekly utilization records
 */
async function getWeeklyUtilizations(req, res, next) {
  const { user_role: userRole } = req.user;
  const { activeSchoolYear, laboratory, weekDates, subjectId, activeTermSem } =
    req.body;

  // Check if user has permission to access the data
  if (!CAN_ACKNOWLEDGE_USERS.includes(userRole)) {
    const response = verifyLaboratories(req.user, laboratory);
    if (response.isError) return res.status(401).send(response.message);
  }

  try {
    // Base query to get weekly utilizations with filtering
    let query = `
        SELECT 
           u.id, u.subject_id, u.schedule_id, u.start_time, u.end_time, u.usage_date, u.usage_hours, u.students_attendance, u.students_time_log, 
           sc.sched_start_time, sc.sched_end_time, sc.class_schedule, sc.is_regular_class, 
           s.code, s.title, s.instructor_id, s.program, s.students, 
           us.full_name AS instructor
        FROM 
           utilizations u
        INNER JOIN 
           subjects s ON u.subject_id = s.id AND school_year = $1
        INNER JOIN 
           schedules sc ON u.schedule_id = sc.id 
        LEFT JOIN 
           users us ON s.instructor_id = us.id
        WHERE 
           s.term_sem = $2 AND u.usage_date = ANY($3::date[]) 
         `;

    const queryParams = [activeSchoolYear, activeTermSem, weekDates];

    // Add laboratory filter if specified
    if (laboratory !== undefined) {
      query += ` AND sc.laboratory = $4 `;
      queryParams.push(laboratory);
    }

    // Add subject filter if specified
    if (subjectId !== undefined) {
      query += ` AND u.subject_id = $5 `;
      queryParams.push(subjectId);
    }

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching weekly utilizations';
    next(err);
  }
}

/**
 * Retrieves utilization remarks for specific week dates
 *
 * @param {Object} req - Express request object with week dates and filtering parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with utilization remarks for the specified week dates
 */
async function getUtilizationRemarksWeekdates(req, res, next) {
  const { laboratory, weekDates, subjectId } = req.body;

  try {
    // Base query to get utilization remarks for specific week dates
    let query = `
        SELECT 
            u.id, u.usage_date, u.start_time, u.end_time, sc.sched_start_time, 
            sc.sched_end_time, sc.class_schedule, sc.is_regular_class, 
            r.unit_number, r.remark, r.problem, r.created_at, r.ticket_no,
            s.code, s.title, us.full_name AS instructor  
        FROM 
            utilizations u
        INNER JOIN 
            subjects s ON u.subject_id = s.id
        INNER JOIN 
            schedules sc ON u.schedule_id = sc.id
        INNER JOIN 
            remarks r ON u.id = r.utilization_id
        LEFT JOIN
            users us ON s.instructor_id = us.id    
        WHERE 
            sc.laboratory = $1 AND u.usage_date = ANY($2)`;

    const queryParams = [laboratory, weekDates];

    // Add subject filter if specified
    if (subjectId) {
      query += ` AND u.subject_id = $3 `;
      queryParams.push(subjectId);
    }

    const result = await pool.query(query, queryParams);

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching utilization remarks';
    next(err);
  }
}

/**
 * Registers a new class utilization
 *
 * @param {Object} req - Express request object with utilization details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addUtilization(req, res, next) {
  const { id: userId, full_name: startedBy } = req.user;

  const {
    scheduleId,
    subjectId,
    subjectTitle,
    code,
    students = [],
    classStartTime,
    laboratory,
    usageDate,
  } = req.body;

  // Check if utilization date is behind 1 month
  const monthsDiff = monthDiff(usageDate, new Date());
  if (monthsDiff > 1) {
    return res
      .status(409)
      .send(
        `Utilization date ${dateConverter(
          usageDate
        )} is behind 1 month please check you date`
      );
  }

  try {
    // Generate a unique ID for the new utilization
    const id = uuidv4();
    // const usageDate = new Date();

    // Search for today's utilization if this utilization already have start time
    // then return if there is alreadt start time

    // Generate initial attendance and time log arrays based on students count
    let tempStudentAttendance = Array(Number(students.length)).fill(false);
    let tempStudentTimeIn = Array(Number(students.length)).fill(null);

    // Prepare columns and values for insertion
    const columns = [
      'id',
      'subject_id',
      'schedule_id',
      'start_time',
      'students_uuid',
      'students_attendance',
      'students_time_log',
      'usage_date',
      'started_by',
    ];
    const values = [
      id,
      subjectId,
      scheduleId,
      classStartTime,
      students,
      tempStudentAttendance,
      tempStudentTimeIn,
      usageDate,
      userId,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new utilization into the database
    const query = `
          INSERT INTO 
              utilizations (${columnNames}) 
          VALUES 
              (${placeholders}) 
          `;

    await pool.query(query, values);

    res.json();
    logger.info(
      chalk.blue(
        `Scheduled Class ${code}-${subjectTitle} for ${laboratory} started by ${startedBy} on ${dateConverter(
          usageDate
        )}`
      )
    );
  } catch (err) {
    err.title = 'Adding utilization';
    next(err);
  }
}

/**
 * Cancels a class utilization
 *
 * @param {Object} req - Express request object with utilization ID and details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function cancelUtilization(req, res, next) {
  const { usageId, cancelledBy, laboratory, code, subjectTitle } = req.body;

  try {
    // Start a transaction to ensure both deletions succeed or fail together
    await pool.query('BEGIN');

    // Delete any remarks associated with the utilization
    await pool.query(`DELETE FROM remarks WHERE utilization_id = $1`, [
      usageId,
    ]);

    // Delete the utilization record
    await pool.query(`DELETE FROM utilizations WHERE id = $1`, [usageId]);

    // Commit the transaction
    await pool.query('COMMIT');

    logger.info(
      chalk.blue(
        `Class utilization ${code}-${subjectTitle} scheduled in ${laboratory} was cancelled by ${cancelledBy} ${dateConverter()}`
      )
    );

    res.json();
  } catch (err) {
    // Rollback the transaction if any error occurs
    await pool.query('ROLLBACK');
    err.title = 'Cancelling utilization';
    next(err);
  }
}

/**
 * Updates the utilization time and usage hours
 *
 * @param {Object} req - Express request object with updated time details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function updateUtilizationTimeAndUsage(req, res, next) {
  const { usageId, usageStartTime, usageEndTime, totalUsageTime } = req.body;

  try {
    // Update the utilization record with new time and usage information
    const query = `UPDATE utilizations SET usage_hours = $1, start_time = $2, end_time = $3 WHERE id = $4`;
    const values = [totalUsageTime, usageStartTime, usageEndTime, usageId];
    await pool.query(query, values);

    res.json();
  } catch (err) {
    err.title = 'Updating utilization time and usage';
    next(err);
  }
}

/**
 * Updates student attendance for a utilization
 *
 * @param {Object} req - Express request object with attendance details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function utilizationAttendance(req, res, next) {
  const { usageId, attendanceIndex, isPresent, usageDate } = req.body;

  try {
    // Start a transaction to ensure data consistency
    await pool.query('BEGIN');

    // Get current attendance and time log data
    const result = await pool.query(
      `SELECT students_time_log, students_attendance FROM utilizations WHERE id = $1`,
      [usageId]
    );

    if (!result.rows.length > 0)
      return res.status(404).send('Utilization not found');

    // Update attendance and time log arrays
    let attendance = result.rows[0].students_attendance;
    let timeLog = result.rows[0].students_time_log;
    attendance[attendanceIndex] = isPresent;

    // Set time log based on attendance status
    if (isPresent === 'true') {
      timeLog[attendanceIndex] = usageDate;
    } else {
      timeLog[attendanceIndex] = null;
    }

    // Update the utilization record with new attendance and time log data
    await pool.query(
      `UPDATE utilizations SET students_attendance = $1, students_time_log = $2 WHERE id = $3`,
      [attendance, timeLog, usageId]
    );

    // Commit the transaction
    await pool.query('COMMIT');

    res.json();
  } catch (err) {
    // Rollback the transaction if any error occurs
    await pool.query('ROLLBACK');
    err.title = 'Updating student attendance';
    next(err);
  }
}

/**
 * Adds end time to a class utilization
 *
 * @param {Object} req - Express request object with end time details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function addClassEndTime(req, res, next) {
  const { id: userId, full_name: endedBy } = req.user;
  const { usageId, endTime, usageHour, laboratory, subjectTitle, code } =
    req.body;

  try {
    // Update the utilization record with end time and usage hours
    await pool.query(
      `UPDATE utilizations SET end_time = $1, usage_hours = $2, ended_by = $3 WHERE id = $4`,
      [endTime, usageHour, userId, usageId]
    );

    res.json();
    logger.info(
      chalk.blue(
        `Class utilization ${code}-${subjectTitle} in ${laboratory} ended by ${endedBy} on ${dateConverter()}`
      )
    );
  } catch (err) {
    err.title = 'Ending utilization';
    next(err);
  }
}

exports.getPrevUtilizations = getPrevUtilizations;
exports.getUtilizationWithScheduleId = getUtilizationWithScheduleId;
exports.getLaboratoryUtilizations = getLaboratoryUtilizations;
exports.getLaboratoryWeeklyUtilizations = getLaboratoryWeeklyUtilizations;
exports.getTermUtilizations = getTermUtilizations;
exports.getWeeklyUtilizations = getWeeklyUtilizations;
exports.getUtilizationRemarksWeekdates = getUtilizationRemarksWeekdates;

exports.addUtilization = addUtilization;
exports.updateUtilizationTimeAndUsage = updateUtilizationTimeAndUsage;
exports.cancelUtilization = cancelUtilization;
exports.utilizationAttendance = utilizationAttendance;
exports.addClassEndTime = addClassEndTime;
