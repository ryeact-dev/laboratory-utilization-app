const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');
const { logger } = require('../util/winstonLogger');
const chalk = require('chalk');
const { verifyLaboratories } = require('../util/verifyLaboratories');
const { isUserAllowed } = require('../util/isUserAllowed');
const {
  isSemestralSubject,
  aggregateSemestralSubjects,
} = require('../util/isSemestralSubject');
const { dateToTime } = require('../util/dateHelpers');

// SCHEDULE STATUS: 1-PENDING 2-APPROVED 3-DISSAPPROVED
// RESERVATION SCHEDULE STEPS : 1-RESERVATION 2-PH APPROVED 3-DEAN APPROVED 4-CUSTODIAN APPROVED
// CLASS SCHEDULE STATUS: 0 - AUTOMATIC TIME , 1 - MANUAL TIME

/**
 * Retrieves schedules for the scheduler view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getSchedulerSchedules(req, res, next) {
  const { laboratory, termsem, schoolyear } = req.query;

  // Verify user has access to the laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) {
    return res.status(401).send('Unauthorized Request.');
  }

  try {
    // Define queries
    const schedulesQuery = `
      SELECT 
        t.*, 
        s.code, s.title, s.instructor_id, s.schedule, s.program, 
        s.end_time AS subject_end_time, s.start_time AS subject_start_time, s.students,
        r.activity_title, r.purpose, r.topic_content, r.makeup_reason, 
        r.programhead_id, r.dean_id,
        u.full_name AS instructor
      FROM 
        schedules t 
      INNER JOIN 
        subjects s ON t.subject_id = s.id AND s.term_sem = $1 AND s.school_year = $2
      LEFT JOIN 
        reservation_detail r ON t.id = r.schedule_id
      LEFT JOIN 
        users u ON s.instructor_id = u.id 
      WHERE 
        t.sched_status < 3 AND t.term_sem = $1 AND t.laboratory = $3
    `;

    const semestralQuery = `
      SELECT 
        s.code, s.title, s.term_sem,
        sc.laboratory
      FROM 
        subjects s
      LEFT JOIN
        schedules sc ON s.id = sc.subject_id
      WHERE 
        s.term_sem = ANY($1) 
      AND s.school_year = $2 
      AND sc.laboratory = $3 
      AND sc.sched_status < 3
      AND sc.is_regular_class = true
      ORDER BY s.code
    `;

    // Get selected terms for semestral subjects
    const selectedTermAndSem = isSemestralSubject(termsem);

    // Prepare query parameters
    const schedulesParams = [termsem, schoolyear, laboratory];
    const semestralParams = [selectedTermAndSem, schoolyear, laboratory];

    // Execute both queries concurrently for better performance
    const [schedulesResult, semestralResult] = await Promise.all([
      pool.query(schedulesQuery, schedulesParams),
      pool.query(semestralQuery, semestralParams),
    ]);

    // Process semestral subjects data
    const semestralSubjects = aggregateSemestralSubjects(
      semestralResult.rows,
      selectedTermAndSem
    );

    // Map and enrich schedule data
    const fetchedSchedules = schedulesResult.rows.map((row) => {
      // Check if subject is semestral
      const isSubjectSemestral =
        semestralSubjects.find((schedule) => schedule.code === row.code)
          ?.isSemestral || false;

      // Return appropriate data based on schedule type
      const { topic_content, makeup_reason, is_regular_class, ...rest } = row;
      return is_regular_class === true
        ? { ...rest, is_regular_class, isSemestral: isSubjectSemestral }
        : { ...row, isSemestral: isSubjectSemestral };
    });

    res.json(fetchedSchedules);
  } catch (err) {
    err.title = 'Fetching schedules for scheduler';
    next(err);
  }
}

// OLD METHOD
// async function getSchedulerSchedules(req, res, next) {
//   const { laboratory, termsem, schoolyear } = req.query;

//   const response = verifyLaboratories(req.user, laboratory);
//   if (response.isError) return res.status(401).send('Unauthorized Request.');

//   try {
//     const query = `
//         SELECT
//           t.*,
//           s.code, s.title, s.instructor_id, s.schedule, s.program, s.end_time AS subject_end_time, s.start_time AS subject_start_time,
//           r.activity_title, r.purpose, r.topic_content, r.makeup_reason, r.programhead_id, r.dean_id,
//           u.full_name AS instructor
//         FROM
//           schedules t
//         INNER JOIN
//           subjects s ON t.subject_id = s.id AND s.term_sem = $1 AND s.school_year = $2
//         LEFT JOIN
//           reservation_detail r ON t.id = r.schedule_id
//         LEFT JOIN
//           users u ON s.instructor_id = u.id
//         WHERE
//           t.sched_status < 3 AND t.term_sem = $1 AND t.laboratory = $3 `;

//     const values = [termsem, schoolyear, laboratory];

//     const semesterQuery = `
//         SELECT
//           s.code, s.title, s.term_sem,
//           sc.laboratory
//         FROM
//           subjects s
//         LEFT JOIN
//           schedules sc ON s.id = sc.subject_id
//         WHERE
//           s.term_sem = ANY($1)
//         AND s.school_year = $2
//         AND sc.laboratory = $3
//         AND sc.sched_status < 3
//         AND sc.is_regular_class = true
//         ORDER BY s.code
//       `;

//     const selectedTermAndSem = isSemestralSubject(termsem);

//     const semesterQueryValues = [selectedTermAndSem, schoolyear, laboratory];

//     const result = await pool.query(query, values);
//     const semesterQueryResult = await pool.query(
//       semesterQuery,
//       semesterQueryValues
//     );

//     const semestralSubjects = aggregateSemestralSubjects(
//       semesterQueryResult.rows,
//       selectedTermAndSem
//     );

//     // console.log(semestralSubjects);

//     const fetchedSchedules = result.rows.map((row) => {
//       const isSubjectSemestral =
//         semestralSubjects.find((schedule) => schedule.code === row.code)
//           ?.isSemestral || false;

//       // console.log(isSubjectSemestral);

//       const { topic_content, makeup_reason, is_regular_class, ...rest } = row;
//       return is_regular_class === true
//         ? { ...rest, is_regular_class, isSemestral: isSubjectSemestral }
//         : { ...row, isSemestral: isSubjectSemestral };
//     });

//     res.json(fetchedSchedules);
//   } catch (err) {
//     err.title = 'Fetching schedules for scheduler';
//     next(err);
//   }
// }

/**
 * Retrieves schedules for utilization based on laboratory and schedule type
 *
 * @param {Object} req - Express request object containing query parameters
 * @param {string} req.query.laboratory - Laboratory identifier
 * @param {string} req.query.termsem - Term/semester identifier
 * @param {string} req.query.class_schedule - Schedule type
 * @param {string} req.query.schoolyear - School year
 * @param {string} req.query.util_type - Utilization type (1: daily, 2: not ended)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getUtilizationSchedules(req, res, next) {
  const { laboratory, termsem, class_schedule, schoolyear, util_type } =
    req.query;

  // Verify user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  try {
    // Base query to get schedule information with related data
    let query = `
      SELECT 
        t.*, 
        s.code, s.title, s.students, s.term_sem, r.activity_title,
        us.full_name AS instructor 
      FROM 
        schedules t 
      INNER JOIN
        subjects s ON t.subject_id = s.id AND s.term_sem = $1 AND s.school_year = $2 
      INNER JOIN 
        users us ON s.instructor_id = us.id
      LEFT JOIN
        reservation_detail r ON t.id = r.schedule_id 
      `;

    // Add conditions based on utilization type
    if (util_type === '2') {
      // For not ended utilizations
      query += `
          INNER JOIN 
            utilizations util ON t.id = util.schedule_id
          WHERE 
            t.laboratory = $3 
            AND t.sched_status = 2 
            AND (t.class_schedule = $4 OR t.class_schedule = 1)
            AND util.end_time IS NULL
            `;
    } else {
      // For daily utilizations
      query += `
          WHERE 
            t.laboratory = $3 
            AND t.sched_status = 2 
            AND (t.class_schedule = $4 OR t.class_schedule = 1)
          `;
    }

    const values = [termsem, schoolyear, laboratory, class_schedule];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching schedules for scheduler';
    next(err);
  }
}

/**
 * Retrieves today's schedules for a specific laboratory
 *
 * @param {Object} req - Express request object containing query parameters
 * @param {string} req.query.laboratory - Laboratory identifier
 * @param {string} req.query.termsem - Term/semester identifier
 * @param {string} req.query.schoolyear - School year
 * @param {string} req.query.class_schedule - Schedule type (converted to number)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getSchedulesForToday(req, res, next) {
  const { laboratory, termsem, schoolyear } = req.query;
  let { class_schedule } = req.query;
  class_schedule = Number(class_schedule);

  // Verify user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  try {
    // Query to get today's approved schedules
    const query = `
      SELECT
          t.sched_start_time, t.sched_end_time, t.laboratory, t.is_regular_class, 
          s.code, s.title, s.instructor, s.schedule, s.program, r.activity_title
      FROM 
          schedules t 
      INNER JOIN 
          subjects s ON t.subject_id = s.id AND s.term_sem = $1 AND school_year = $2
      LEFT JOIN 
          reservation_detail r ON t.id = r.schedule_id 
      WHERE 
          t.laboratory = $3 AND t.sched_status = 2 AND (t.class_schedule = $4 OR t.class_schedule = 3)`;

    const values = [termsem, schoolyear, laboratory, class_schedule];
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching schedules for scheduler';
    next(err);
  }
}

// TODO CREATE A PAGINATION FETCHING FOR RESERVATIONS
// TODO CREATE A FILTER THAT ONLY THE REQUESTOR AND DEAN CAN VIEW REQUESTORS REQUEST

/**
 * Retrieves reservation schedules based on user role and permissions
 *
 * @param {Object} req - Express request object containing body parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getReservationSchedules(req, res, next) {
  const {
    activeSchoolYear,
    activeTermSem,
    userRole,
    fullName,
    laboratory,
    page,
    perpage,
  } = req.body;

  // Adjust laboratory access based on user role
  let accessibleLaboratories = laboratory;
  if (userRole === 'Dean' || userRole === 'Admin')
    accessibleLaboratories = null;

  // Base query for retrieving reservation schedules
  let query = `
              SELECT 
                t.*, 
                s.code, s.title, s.instructor, s.schedule, s.term_sem, 
                r.activity_title, r.purpose, r.topic_content, r.makeup_reason 
              FROM 
                schedules t 
              LEFT JOIN 
                subjects s 
              ON 
                t.subject_id = s.id 
              AND 
                school_year = $1 
              AND 
                s.term_sem = $2 `;

  let values = [activeSchoolYear, activeTermSem, 'false'];

  // Add role-specific conditions to the query
  if (userRole === 'Dean' || userRole === 'Admin') {
    query += `
              LEFT JOIN
                reservation_detail r 
              ON 
                t.id = r.schedule_id 
              WHERE
                t.is_regular_class = $3::boolean 
              `;
  } else if (userRole === 'Program Head') {
    query += `
              LEFT JOIN
                reservation_detail r 
              ON 
                t.id = r.schedule_id
              WHERE
                t.is_regular_class = $3::boolean 
              AND
                t.laboratory = ANY($4) `;

    values.push(accessibleLaboratories);
  } else {
    // For other roles (instructors)
    query += `
              AND
                s.instructor 
              LIKE $4 
              LEFT JOIN 
                reservation_detail r 
              ON 
                t.id = r.schedule_id 
              WHERE t.is_regular_class = $3::boolean `;
    values.push(fullName);
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching paginated list for reservation schedules';
    next(err);
  }
}

/**
 * Registers a new class schedule or reservation
 *
 * @param {Object} req - Express request object
 * @param {Object} req.user - User information including role and name
 * @param {Object} req.body - Schedule details
 * @param {string} req.body.activity_title - Title of the activity (for reservations)
 * @param {string} req.body.classSchedule - Type of schedule
 * @param {boolean} req.body.is_regular_class - Whether this is a regular class
 * @param {string} req.body.laboratory - Laboratory identifier
 * @param {Array} req.body.selected_day - Selected days for recurrence
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function addClassSchedule(req, res, next) {
  const { user_role, full_name, id: user_id } = req.user;

  // Verify user has permission to add schedules
  if (!isUserAllowed(user_role)) {
    return res.status(401).send('Unauthorized Request.');
  }

  // Extract schedule details from request body
  const {
    activity_title,
    classSchedule,
    disapproval_reason,
    end_time,
    is_regular_class,
    laboratory,
    purpose,
    schedule,
    sched_status = 2, // 2 for approved by custodian status
    selected_day,
    start_time,
    steps = 4, // 4 for approved request
    subjectCode,
    subjectId,
    subjectTitle,
    term_sem,
    program,
  } = req.body;

  // Initialize schedule parameters
  let recurrenceRule = selected_day;
  let requestSteps = steps;
  let requestStatus = sched_status;

  // Handle regular class specific settings
  if (is_regular_class === true) {
    // Convert selected days array to comma-separated string
    recurrenceRule = selected_day.join(',');
    requestSteps = 4; // Regular class is auto-approved by custodian
    requestStatus = 2; // Regular class is auto-approved
  }

  try {
    const scheduleId = uuidv4();
    const createdAt = new Date();

    // Prepare schedule insertion data
    const scheduleColumns = [
      'id',
      'subject_id',
      'sched_start_time',
      'sched_end_time',
      'laboratory',
      'class_schedule',
      'recurrence_rule',
      'is_regular_class',
      'steps',
      'sched_status',
      'term_sem',
      'added_by',
      'user_id',
      'created_at',
    ];

    const scheduleValues = [
      scheduleId,
      subjectId,
      start_time,
      end_time,
      laboratory,
      classSchedule,
      recurrenceRule,
      is_regular_class,
      requestSteps,
      requestStatus,
      term_sem,
      full_name,
      user_id,
      createdAt,
    ];

    // Create schedule insertion query
    const scheduleColumnNames = scheduleColumns.join(', ');
    const schedulePlaceholders = scheduleColumns
      .map((_, i) => `$${i + 1}`)
      .join(', ');
    const scheduleQuery = `INSERT INTO schedules (${scheduleColumnNames}) VALUES (${schedulePlaceholders})`;

    await pool.query('BEGIN');
    await pool.query(scheduleQuery, scheduleValues);

    // Handle reservation schedule if not a regular class
    if (is_regular_class === false) {
      // Get custodian ID for the laboratory
      const custodianResult = await pool.query(
        'SELECT id FROM users WHERE $1 = ANY(laboratory)',
        [laboratory]
      );
      const custodianId = custodianResult.rows[0].id;

      // Prepare reservation insertion data
      const reservationColumns = [
        'schedule_id',
        'program',
        'purpose',
        'activity_title',
        'disapproval_reason',
        'custodian_id',
      ];

      const reservationValues = [
        scheduleId,
        program,
        purpose,
        activity_title,
        disapproval_reason,
        custodianId,
      ];

      // Create reservation insertion query
      const reservationColumnNames = reservationColumns.join(', ');
      const reservationPlaceholders = reservationColumns
        .map((_, i) => `$${i + 1}`)
        .join(', ');
      const reservationQuery = `INSERT INTO reservation_detail (${reservationColumnNames}) VALUES (${reservationPlaceholders})`;

      await pool.query(reservationQuery, reservationValues);
    }

    await pool.query('COMMIT');

    // Format times for logging
    const subjectStartTime = dateToTime(start_time);
    const subjectEndTime = dateToTime(end_time);

    // Log successful schedule creation
    logger.info(
      `Code ${subjectCode}-${subjectTitle} with schedule time ${subjectStartTime} to ${subjectEndTime} successfully added on scheduler by ${full_name} on ${dateConverter()}`
    );

    res.json();
  } catch (err) {
    await pool.query('ROLLBACK');
    err.title = 'Adding class schedule';
    next(err);
  }
}

/**
 * Transfers a schedule from one laboratory to another
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Transfer details
 * @param {string} req.body.scheduleId - ID of schedule to transfer
 * @param {string} req.body.fromLaboratory - Source laboratory
 * @param {string} req.body.toLaboratory - Destination laboratory
 * @param {Array} req.body.selectedDays - New schedule days
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function transferSchedule(req, res, next) {
  const {
    scheduleId,
    fromLaboratory,
    toLaboratory,
    selectedDays,
    subject,
    endTime,
    startTime,
  } = req.body;

  // Validate destination laboratory
  if (toLaboratory === null) {
    return res.status(400).send('Please select a laboratory');
  }

  const { user_role, full_name } = req.user;

  // Verify user has permission to transfer schedules
  if (
    user_role !== 'Custodian' &&
    user_role !== 'Admin' &&
    user_role !== 'STA'
  ) {
    return res.status(401).send('Unauthorized Request.');
  }

  try {
    // Update schedule with new laboratory and days
    await pool.query(
      `UPDATE schedules SET laboratory = $1, recurrence_rule = $2 WHERE id = $3`,
      [toLaboratory, selectedDays.join(','), scheduleId]
    );

    // Format times for logging
    const subjectStartTime = dateToTime(startTime);
    const subjectEndTime = dateToTime(endTime);

    // Log successful transfer
    logger.info(
      chalk.blue(
        `Subject: ${subject} successfully transferred from ${fromLaboratory} to ${toLaboratory} with time ${subjectStartTime} to ${subjectEndTime} by ${full_name} :: ${dateConverter()}`
      )
    );

    res.json();
  } catch (err) {
    err.title = 'Transferring class schedule';
    next(err);
  }
}

/**
 * Deletes a schedule and its associated reservation details
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Schedule deletion details
 * @param {string} req.body.scheduleId - ID of schedule to delete
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteSchedule(req, res, next) {
  const { scheduleId } = req.body;
  const { user_role, full_name } = req.user;

  // Verify user has permission to delete schedules
  if (
    user_role !== 'Custodian' &&
    user_role !== 'Admin' &&
    user_role !== 'STA'
  ) {
    return res.status(401).send('Unauthorized Request.');
  }

  try {
    await pool.query('BEGIN');

    // Delete associated reservation details first
    await pool.query(`DELETE FROM reservation_detail WHERE schedule_id = $1`, [
      scheduleId,
    ]);

    // Delete the schedule and return its details for logging
    const deletedSchedule = await pool.query(
      `DELETE FROM schedules WHERE id = $1 RETURNING *`,
      [scheduleId]
    );

    // Log deletion details
    logger.info(chalk.blue(deletedSchedule.rows[0]));
    logger.info(
      chalk.blue(
        `The above schedule has been removed in the schedule by ${full_name} :: ${dateConverter()}`
      )
    );

    await pool.query('COMMIT');
    res.json();
  } catch (err) {
    await pool.query('ROLLBACK');
    // Handle constraint violation (e.g., schedule has active utilizations)
    if (err.constraint) {
      return res
        .status(403)
        .send('Schedules with laboratory utilizations cannot be remove!');
    }
    err.title = 'Deleting class schedule';
    next(err);
  }
}

exports.getSchedulerSchedules = getSchedulerSchedules;
exports.getUtilizationSchedules = getUtilizationSchedules;
exports.getReservationSchedules = getReservationSchedules;
exports.addClassSchedule = addClassSchedule;
exports.transferSchedule = transferSchedule;
exports.deleteSchedule = deleteSchedule;
exports.getSchedulesForToday = getSchedulesForToday;
