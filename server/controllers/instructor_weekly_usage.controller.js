const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { userRoleStep, CAN_ACKNOWLEDGE_USERS } = require('../util/userRoleStep');

const socketMiddleware = require('../middlewares/socketIo');
const {
  addSingleLaboratoryOrientation,
} = require('./laboratory_orientation.controller');
const { dbActiveSchoolYear } = require('../util/dbActiveSchoolYear');

// Roles that are allowed to acknowledge weekly usage reports
const userRolesAllowedToAcknowledgeReports = [
  'Faculty',
  'Program Head',
  'Custodian',
  'Admin',
  'Dean',
];

/**
 * Retrieves submitted reports for a specific subject and week dates
 *
 * @param {Object} req - Express request object with subjectId and weekDates in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with report details or empty if unauthorized
 */
async function getSubmittedReportsByWeekdates(req, res, next) {
  const { subjectId, weekDates } = req.body;
  const { user_role: userRole } = req.user;

  // Check if user has permission to view reports
  if (!userRolesAllowedToAcknowledgeReports.includes(userRole)) {
    return res.json();
  }

  try {
    // Query to get report details with signatures
    const reportQuery = `
          SELECT 
            step, instructor_acknowledged, dean_acknowledged, created_at, usc.full_name AS custodian, 
            usc.esign_url as custodian_esign, usi.esign_url as instructor_esign
          FROM
            instructor_weekly_usage
          INNER JOIN
            users usc ON usc.id = custodian_id 
          INNER JOIN
            users usi ON usi.id = instructor_id   
          WHERE
            subject_id = $1 
          AND
             weekdates && $2
          `;

    const queryParams = [subjectId, weekDates];
    const reportResult = await pool.query(reportQuery, queryParams);

    res.json(reportResult.rows[0]);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Getting submitted reports by weekdates';
    next(err);
  }
}

/**
 * Retrieves paginated reports based on user role and filters
 *
 * @param {Object} req - Express request object with pagination and filter parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated reports and counts
 */
async function getPaginatedReports(req, res, next) {
  const {
    user_role: userRole,
    id: userId,
    laboratory: userLaboratories,
  } = req.user;

  // Check if user has permission to view reports
  if (!userRolesAllowedToAcknowledgeReports.includes(userRole)) {
    return res.json();
  }

  const { termsem, wasAcknowledged, laboratory, userRoleStep } = req.query;
  const { school_year } = await dbActiveSchoolYear();

  // Determine which laboratories to filter by based on user role
  let selectedLaboratories =
    userRole === 'Admin' || userRole === 'Dean' ? [] : userLaboratories;

  if (laboratory.trim() !== '') {
    selectedLaboratories = [laboratory];
  }

  // Parse pagination parameters
  let { page, perpage } = req.query;
  if (Number(page) < 0) page = 0;
  perpage = Number(perpage);

  try {
    // Base query for fetching reports
    let reportsQuery = `
      SELECT DISTINCT
        iwu.id,
        iwu.weekdates,
        iwu.step,
        iwu.laboratory,
        iwu.selected_date,
        iwu.subject_id,
        iwu.created_at,
        iwu.week_number,
        s.title,
        s.code,
        s.start_time AS subject_start_time,
        s.end_time AS subject_end_time,
        s.term_sem,
        c.full_name AS custodian,
        d.full_name AS dean,
        f.full_name AS instructor, f.department AS instructor_department,
        sc.is_regular_class
      FROM
        instructor_weekly_usage AS iwu
      INNER JOIN
        subjects AS s ON iwu.subject_id = s.id
      INNER JOIN
        users AS c ON iwu.custodian_id = c.id
      INNER JOIN
        users AS f ON iwu.instructor_id = f.id
      LEFT JOIN
        users AS d ON iwu.dean_id = d.id
      INNER JOIN
        schedules sc ON iwu.subject_id = sc.subject_id
      WHERE 
        s.term_sem = $1 AND s.school_year = $2 `;

    // Query for counting total results for pagination
    let totalCountQuery = ` 
        SELECT DISTINCT COUNT(*) 
        FROM
          instructor_weekly_usage AS iwu
        INNER JOIN
          subjects AS s ON iwu.subject_id = s.id
        WHERE 
          s.term_sem = $1 AND s.school_year = $2
        `;

    // Query for counting reports that need acknowledgement
    let pendingAcknowledgementQuery = ` 
        SELECT DISTINCT COUNT(*) 
        FROM
          instructor_weekly_usage AS iwu
        INNER JOIN
          subjects AS s ON iwu.subject_id = s.id
        WHERE 
          s.term_sem = $1 AND s.school_year = $2 
        `;

    // Determine step value based on user role
    const stepValue =
      userRole === 'Custodian' || userRole === 'Admin' ? 2 : userRoleStep;

    // Group user roles for conditional logic
    const facultyAndProgramHead = userRolesAllowedToAcknowledgeReports.slice(
      0,
      2
    );
    const adminAndCustodian = userRolesAllowedToAcknowledgeReports.slice(2, 4);

    // Initialize query parameters
    let queryParams = [
      termsem,
      school_year,
      Number(stepValue),
      perpage,
      page * perpage,
    ];
    let totalCountParams = [termsem, school_year, Number(stepValue)];
    let pendingAcknowledgementParams = [termsem, school_year];

    // Determine step condition based on acknowledgement status
    const stepCondition = wasAcknowledged === 'true' ? '>' : '<';
    const stepEqualCondition = wasAcknowledged === 'true' ? '=' : '<';

    // Add role-specific conditions to queries
    if (adminAndCustodian.includes(userRole)) {
      // Admin/Custodian: Show reports based on acknowledgement status
      reportsQuery += ` AND iwu.step ${stepCondition === '<' ? '<=' : '>'} $3 `;
      totalCountQuery += ` AND iwu.step ${
        stepCondition === '<' ? '<=' : '>'
      } $3 `;
      pendingAcknowledgementQuery += ` AND iwu.step <= 2 `;
    } else if (userRole === 'Dean') {
      // Dean: Show reports they need to acknowledge
      reportsQuery += `AND iwu.step ${stepEqualCondition} $3 AND iwu.dean_id = $6 `;
      queryParams.push(userId);

      totalCountQuery += `AND iwu.step ${stepEqualCondition} $3 AND iwu.dean_id = $4 `;
      totalCountParams.push(userId);

      pendingAcknowledgementQuery += ` AND iwu.step = 2 AND iwu.dean_id = $3 `;
      pendingAcknowledgementParams.push(userId);
    } else {
      // Other roles: Show reports based on step status
      reportsQuery += ` AND iwu.step ${stepCondition === '>' ? '>=' : '<'} $3 `;
      totalCountQuery += ` AND iwu.step ${
        stepCondition === '>' ? '>=' : '<'
      } $3 `;
      pendingAcknowledgementQuery += ` AND iwu.step = 1 `;
    }

    // Add instructor-specific filtering for faculty/program head
    if (facultyAndProgramHead.includes(userRole)) {
      reportsQuery += ` AND iwu.instructor_id = $6 `;
      queryParams.push(userId);

      totalCountQuery += ` AND iwu.instructor_id = $4 `;
      totalCountParams.push(userId);

      pendingAcknowledgementQuery += ` AND iwu.instructor_id = $3 `;
      pendingAcknowledgementParams.push(userId);
    }

    // Add laboratory filtering if applicable
    if (selectedLaboratories.length > 0) {
      reportsQuery += `AND iwu.laboratory = ANY($${queryParams.length + 1}) `;
      queryParams.push(selectedLaboratories);

      totalCountQuery += `AND iwu.laboratory = ANY($${
        totalCountParams.length + 1
      }) `;
      totalCountParams.push(selectedLaboratories);

      pendingAcknowledgementQuery += `AND iwu.laboratory = ANY($${
        pendingAcknowledgementParams.length + 1
      }) `;
      pendingAcknowledgementParams.push(selectedLaboratories);
    }

    // Add sorting and pagination
    reportsQuery += 'ORDER BY iwu.week_number DESC, s.code LIMIT $4 OFFSET $5 ';

    // Execute all queries concurrently for better performance
    const [reportsResult, totalCountResult, pendingAcknowledgementResult] =
      await Promise.all([
        pool.query(reportsQuery, queryParams),
        pool.query(totalCountQuery, totalCountParams),
        pool.query(pendingAcknowledgementQuery, pendingAcknowledgementParams),
      ]);

    // Check if there are more results available
    const hasMoreResults = reportsResult.rows.length === perpage;

    return res.json({
      reports: reportsResult.rows,
      hasMore: hasMoreResults,
      countResult: totalCountResult.rows[0].count,
      forAcknowledgement: pendingAcknowledgementResult.rows[0].count,
    });
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Getting submitted reports';
    next(err);
  }
}

/**
 * Gets the current step status of a report
 *
 * @param {Object} req - Express request object with subjectId and weekDates in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with step status
 */
async function getStepStatus(req, res, next) {
  const { subjectId, weekDates } = req.body;

  try {
    const stepStatusResult = await pool.query(
      `SELECT step FROM instructor_weekly_usage WHERE subject_id = $1 AND weekdates && $2`,
      [subjectId, weekDates]
    );

    res.json(stepStatusResult.rows);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Getting step status';
    next(err);
  }
}

/**
 * Adds a single report submission
 *
 * @param {Object} req - Express request object with report details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addReportSubmission(req, res, next) {
  const { user_role: userRole, id: custodianId } = req.user;

  // Only custodians can submit reports
  if (userRole !== 'Custodian')
    return res.status(401).send('Unauthorized user');

  const { id: schoolYearId } = await dbActiveSchoolYear();

  const {
    scheduleId,
    utilizationId,
    usageDate,
    subjectId,
    weekDates,
    laboratory,
    instructorId,
    weekNumber,
    usageHours,
    selectedDate,
    userStep,
    subjectCode,
    subjectTitle,
    activeSchoolYear,
  } = req.body;

  // Determine step based on user role or override
  const stepValue = userStep !== null ? userStep : userRoleStep(userRole);

  try {
    // Check if report already exists
    const existingReportResult = await pool.query(
      `SELECT id FROM instructor_weekly_usage WHERE subject_id = $1 AND weekdates && $2`,
      [subjectId, weekDates]
    );

    if (existingReportResult.rows.length > 0)
      return res.status(409).send('Report already submitted');

    // Generate unique ID for new report
    const reportId = uuidv4();

    // Prepare columns and values for insertion
    const reportColumns = [
      'id',
      'subject_id',
      'weekdates',
      'step',
      'laboratory',
      'week_number',
      'usage_hours',
      'selected_date',
      'custodian_id',
      'instructor_id',
    ];

    const reportValues = [
      reportId,
      subjectId,
      weekDates,
      stepValue,
      laboratory,
      weekNumber,
      usageHours,
      selectedDate,
      custodianId,
      instructorId,
    ];

    // Add acknowledgement data if step is overridden
    const tempDeanUUID = 'e70826ca-4456-450b-8bd6-88e949a5da07';
    if (userStep !== null) {
      reportColumns.push('instructor_acknowledged', 'dean_id');
      reportValues.push(new Date(), tempDeanUUID);
    }

    // Prepare SQL query
    const columnNames = reportColumns.join(', ');
    const placeholders = reportColumns.map((_, i) => `$${i + 1}`).join(', ');
    const insertQuery = `INSERT INTO instructor_weekly_usage (${columnNames}) VALUES (${placeholders})`;

    // Begin transaction
    await pool.query('BEGIN');

    // Insert report
    await pool.query(insertQuery, reportValues);

    // Check if laboratory orientation is needed
    if (Number(usageHours) > 0 && usageDate) {
      // Check if orientation exists or if this is the first utilization
      const orientationCheckResult = await pool.query(
        `
          SELECT 
            ( SELECT lo.id 
            FROM laboratory_orientation AS lo 
            INNER JOIN schedules AS sc ON lo.schedule_id = sc.id
            INNER JOIN subjects s ON sc.subject_id = s.id
            WHERE s.code = $1 
            AND s.title = $2 
            AND s.school_year = $3 
            AND sc.laboratory = $4 ) as orientation_id,

            ( SELECT COUNT(*) 
            FROM utilizations u
            INNER JOIN subjects s ON u.subject_id = s.id
            WHERE s.code = $1 
            AND s.title = $2 
            AND s.school_year = $3
            AND u.usage_date < $5 ) as previous_utilizations_count 
         `,
        [
          subjectCode.trim(),
          subjectTitle.trim(),
          activeSchoolYear,
          laboratory,
          usageDate,
        ]
      );

      // Add orientation if needed
      if (
        orientationCheckResult.rows[0].orientation_id === null &&
        orientationCheckResult.rows[0].previous_utilizations_count === '0'
      ) {
        await addSingleLaboratoryOrientation(
          scheduleId,
          utilizationId,
          custodianId,
          instructorId,
          usageDate,
          schoolYearId,
          subjectCode.trim(),
          subjectTitle.trim(),
          next
        );
      }
    }

    // Notify clients via WebSocket
    const io = socketMiddleware.getIO();
    io.emit('report:subject-weekly-utilizations');
    io.emit('laboratory-orientation');

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send('Report submitted successfully');
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Adding single report submission';
    next(err);
  }
}

/**
 * Adds multiple report submissions in batch
 *
 * @param {Object} req - Express request object with array of reports in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addManyReportSubmission(req, res, next) {
  const { user_role: userRole, id: custodianId } = req.user;

  // Only custodians can submit reports
  if (userRole !== 'Custodian')
    return res.status(401).send('Unauthorized user');

  const { forAddingData } = req.body;

  try {
    // Extract subject IDs and week dates for checking existing reports
    const subjectIds = forAddingData.map((report) => report.subjectId);
    const weekDates = forAddingData.map((report) => report.weekDates);

    const { id: schoolYearId } = await dbActiveSchoolYear();

    // Check for existing reports
    const existingReportsResult = await pool.query(
      `SELECT subject_id, step FROM instructor_weekly_usage WHERE subject_id = ANY($1) AND weekdates && $2::text[]`,
      [subjectIds, weekDates]
    );

    const submittedSubjectIds = existingReportsResult.rows.map(
      (row) => row.subject_id
    );

    // Process all reports (will update existing ones)
    const reportsToProcess = [...forAddingData];

    // Create promises for all report submissions
    const reportSubmissionPromises = reportsToProcess.map((report) => {
      const {
        subjectId,
        weekDates,
        laboratory,
        instructorId,
        weekNumber,
        usageHours,
        userStep,
        selectedDate,
      } = report;

      // Determine step based on user role or override
      const stepValue = userStep !== null ? userStep : userRoleStep(userRole);
      const reportId = uuidv4();

      // Prepare columns and values
      const reportColumns = [
        'subject_id',
        'weekdates',
        'laboratory',
        'week_number',
        'usage_hours',
        'selected_date',
      ];

      const reportValues = [
        subjectId,
        weekDates,
        laboratory,
        weekNumber,
        usageHours,
        selectedDate,
      ];

      // Add acknowledgement data if step is overridden
      const tempDeanUUID = 'e70826ca-4456-450b-8bd6-88e949a5da07';
      if (userStep !== null) {
        reportColumns.push('instructor_acknowledged', 'dean_id');
        reportValues.push(new Date(), tempDeanUUID);
      }

      // Check if report already exists
      const isExistingReport = submittedSubjectIds.some(
        (existingSubjectId) => existingSubjectId === subjectId
      );

      let query = '';

      // Update existing report or insert new one
      if (isExistingReport) {
        // Update existing report
        const setValues = reportColumns
          .map((column, i) => `${column} = $${i + 1}`)
          .join(', ');

        query = `
                 UPDATE instructor_weekly_usage
                 SET ${setValues}
                 WHERE subject_id = $${reportValues.length + 1}
                 AND weekdates && $${reportValues.length + 2}
                 `;

        reportValues.push(subjectId, weekDates);
      } else {
        // Insert new report
        reportColumns.push('custodian_id', 'instructor_id', 'id', 'step');
        reportValues.push(custodianId, instructorId, reportId, stepValue);
        const columnNames = reportColumns.join(', ');
        const placeholders = reportColumns
          .map((_, i) => `$${i + 1}`)
          .join(', ');

        query = `INSERT INTO instructor_weekly_usage (${columnNames}) VALUES (${placeholders})`;
      }

      return pool.query(query, reportValues);
    });

    // Begin transaction
    await pool.query('BEGIN');

    // Execute all report submissions
    await Promise.all(reportSubmissionPromises);

    // Check for errors
    await checkForQueryErrors(reportSubmissionPromises, forAddingData);

    // Process laboratory orientations
    for (const report of reportsToProcess) {
      const {
        scheduleId,
        utilizationId,
        usageDate,
        laboratory,
        instructorId,
        usageHours,
        activeSchoolYear,
        subjectCode,
        subjectTitle,
      } = report;

      // Check if orientation is needed
      if (Number(usageHours) > 0 && usageDate) {
        // Check if orientation exists or if this is the first utilization
        const orientationCheckResult = await pool.query(
          `
            SELECT 
              ( SELECT lo.id 
              FROM laboratory_orientation AS lo 
              INNER JOIN schedules AS sc ON lo.schedule_id = sc.id
              INNER JOIN subjects s ON sc.subject_id = s.id
              WHERE s.code = $1 
              AND s.title = $2 
              AND s.school_year = $3 
              AND sc.laboratory = $4 ) as orientation_id,

              ( SELECT COUNT(*) 
              FROM utilizations u
              INNER JOIN subjects s ON u.subject_id = s.id
              WHERE s.code = $1 
              AND s.title = $2 
              AND s.school_year = $3
              AND u.usage_date < $5 ) as previous_utilizations_count 
           `,
          [
            subjectCode.trim(),
            subjectTitle.trim(),
            activeSchoolYear,
            laboratory,
            usageDate,
          ]
        );

        // Add orientation if needed
        if (
          orientationCheckResult.rows[0].orientation_id === null &&
          orientationCheckResult.rows[0].previous_utilizations_count === '0'
        ) {
          await addSingleLaboratoryOrientation(
            scheduleId,
            utilizationId,
            custodianId,
            instructorId,
            usageDate,
            schoolYearId,
            subjectCode.trim(),
            subjectTitle.trim(),
            next
          );
        }
      }
    }

    // Commit transaction
    await pool.query('COMMIT');

    // Count new reports (not previously submitted)
    const newReportsCount = forAddingData.filter(
      (report) => !submittedSubjectIds.includes(report.subjectId)
    ).length;

    // Prepare success message
    const successMessage = `${submittedSubjectIds.length} Report(s) are already submitted, ${newReportsCount} new report(s) successfully submitted`;

    // Notify clients via WebSocket
    const io = socketMiddleware.getIO();
    io.emit('report:subject-weekly-utilizations');

    res.status(200).send(successMessage);
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Adding multiple report submissions';
    next(err);
  }
}

/**
 * Checks for errors in query promises
 *
 * @param {Array} promises - Array of query promises
 * @param {Array} subjects - Array of subject data
 * @returns {boolean} True if errors were found
 */
async function checkForQueryErrors(promises, subjects) {
  const results = await Promise.allSettled(promises);
  const errors = results
    .map((result, index) =>
      result.status === 'rejected'
        ? { index, reason: result.reason, subject: subjects[index] }
        : null
    )
    .filter(Boolean);

  if (errors.length > 0) {
    console.error('Rejected queries:', errors);
  }

  return errors.length > 0;
}

/**
 * Updates the step status of a report
 *
 * @param {Object} req - Express request object with report details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateStepStatus(req, res, next) {
  const { user_role: userRole } = req.user;
  const { deanId, subjectId, weekDates } = req.body;

  // Check if user has permission to acknowledge reports
  if (!CAN_ACKNOWLEDGE_USERS.includes(userRole))
    return res.status(401).send('Unauthorized user');

  // Determine step based on user role
  const stepValue = userRole === 'Custodian' ? 2 : userRoleStep(userRole);

  try {
    const currentTimestamp = new Date();
    let updateQuery = `UPDATE instructor_weekly_usage SET step = $3 `;
    let queryParams = [subjectId, weekDates, stepValue, currentTimestamp];

    // Group user roles for conditional logic
    const facultyProgHeadAndCustodian =
      userRolesAllowedToAcknowledgeReports.slice(0, 3);

    // Add role-specific fields to update
    if (facultyProgHeadAndCustodian.includes(userRole)) {
      updateQuery += `, instructor_acknowledged = $4, dean_id = $5 `;
      queryParams.push(deanId);
    } else if (userRole === 'Dean') {
      updateQuery += `, dean_acknowledged = $4 `;
    } else
      return res
        .status(401)
        .send('Unauthorized request for updating single report.');

    // Complete the query
    updateQuery += ' WHERE subject_id = $1 AND weekdates && $2';

    // Execute update
    await pool.query(updateQuery, queryParams);

    res.status(200).send('Report has been acknowledged');
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Updating step status';
    next(err);
  }
}

/**
 * Updates multiple reports in batch
 *
 * @param {Object} req - Express request object with reportIds and deanId in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateManyReports(req, res, next) {
  const { user_role: userRole } = req.user;
  const { reportIds, deanId } = req.body;
  const currentTimestamp = new Date();

  // Check if user has permission to acknowledge reports
  if (!CAN_ACKNOWLEDGE_USERS.includes(userRole))
    return res.status(401).send('Unauthorized user');

  // Determine step based on user role
  const stepValue = userRole === 'Custodian' ? 2 : userRoleStep(userRole);

  try {
    let updateQuery = `UPDATE instructor_weekly_usage SET step = $2`;
    let queryParams = [reportIds, stepValue, currentTimestamp];

    // Group user roles for conditional logic
    const facultyProgHeadAndCustodian =
      userRolesAllowedToAcknowledgeReports.slice(0, 3);

    // Add role-specific fields to update
    if (facultyProgHeadAndCustodian.includes(userRole)) {
      updateQuery += `, instructor_acknowledged = $3, dean_id = $4 `;
      queryParams.push(deanId);
    } else if (userRole === 'Dean') {
      updateQuery += `, dean_acknowledged = $3 `;
    } else
      return res
        .status(401)
        .send('Unauthorized request for updating multiple reports.');

    // Complete the query
    updateQuery += ' WHERE id = ANY($1)';

    // Execute update
    await pool.query(updateQuery, queryParams);

    res.json(`Updated ${reportIds.length} reports successfully`);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Update many report';
    next(err);
  }
}

/**
 * Deletes a weekly usage report
 *
 * @param {Object} req - Express request object with report id in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteWeeklyUsageReport(req, res, next) {
  const { full_name } = req.user;
  try {
    const { id } = req.params;

    // Delete report and return deleted data for logging
    const deleteQuery = `
        DELETE FROM instructor_weekly_usage
        WHERE id = $1 
        RETURNING *
        `;
    const queryParams = [id];

    const deletedReportResult = await pool.query(deleteQuery, queryParams);

    // Log deletion for audit purposes
    console.log(
      `Deleted weekly usage report with id ${id} and laboratory ${deletedReportResult?.rows[0]?.laboratory} successfully by ${full_name}`
    );

    res.json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Delete weekly usage report';
    next(err);
  }
}

exports.getPaginatedReports = getPaginatedReports;
exports.getSubmittedReportsByWeekdates = getSubmittedReportsByWeekdates;
exports.addReportSubmission = addReportSubmission;
exports.addManyReportSubmission = addManyReportSubmission;
exports.getStepStatus = getStepStatus;
exports.updateStepStatus = updateStepStatus;
exports.updateManyReports = updateManyReports;
exports.deleteWeeklyUsageReport = deleteWeeklyUsageReport;
