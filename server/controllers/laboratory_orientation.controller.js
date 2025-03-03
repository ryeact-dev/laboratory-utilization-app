const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { userRoleStep, CAN_ACKNOWLEDGE_USERS } = require('../util/userRoleStep');
const { dbActiveSchoolYear } = require('../util/dbActiveSchoolYear');

const socketMiddleware = require('../middlewares/socketIo');
const {
  isSemestralSubject,
  aggregateSemestralSubjects,
} = require('../util/isSemestralSubject');

// Report Status: 0 - For Review, 1 - Acknowledged, 2 - Rejected

/**
 * User roles that are allowed to acknowledge laboratory orientation reports
 */
const userRolesAllowedToAcknowledgeReports = [
  'Faculty',
  'Program Head',
  'Custodian',
];

/**
 * Retrieves laboratory orientation records with pagination and filtering
 *
 * @param {Object} req - Express request object with pagination and filter parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with paginated orientations and counts
 */
async function getLaboratoryOrientation(req, res, next) {
  const {
    user_role: userRole,
    id: custodianId,
    laboratory: userLaboratories,
  } = req.user;

  const { page, limit, laboratory, schoolYear, termSem, statusSelection } =
    req.body;

  // Check if user has permission to view orientations
  if (userRole !== 'Custodian' && userRole !== 'Admin')
    return res.status(401).send('Unauthorized user');

  // Determine which laboratories to filter by based on user role
  let selectedLaboratory = userRole === 'Admin' ? [] : userLaboratories;

  if (laboratory.trim() !== '') {
    selectedLaboratory = [laboratory];
  }

  try {
    // Base query for fetching laboratory orientations with related data
    let orientationsQuery = `
          SELECT DISTINCT
            lo.*,
            sy.school_year, sc.laboratory, sc.sched_start_time, sc.sched_end_time,
            s.program, 
            u.full_name AS custodian, u.esign_url AS custodian_esign, 
            i.full_name AS instructor, i.esign_url AS instructor_esign
          FROM
            laboratory_orientation AS lo
          INNER JOIN
            schoolyear AS sy ON lo.school_year_id = sy.id
          INNER JOIN
            schedules AS sc ON lo.schedule_id = sc.id
          INNER JOIN
            subjects AS s ON sc.subject_id = s.id
          INNER JOIN
            users AS u ON lo.custodian_id = u.id
          INNER JOIN
            users AS i ON lo.instructor_id = i.id
          WHERE
            lo.status = $1 AND s.school_year = $2 AND s.term_sem = $3
          `;

    const queryParams = [statusSelection, schoolYear, termSem, limit, page];

    // Query for counting orientations that need acknowledgement
    let pendingAcknowledgementQuery = `
              SELECT COUNT(*)
              FROM 
                laboratory_orientation AS lo
              INNER JOIN
                schedules AS sc ON lo.schedule_id = sc.id
              WHERE 
                status = 0 AND sc.term_sem = $1
             `;

    const countQueryParams = [termSem];

    // Query for fetching semestral subjects
    let semestralSubjectsQuery = `
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
                AND sc.sched_status < 3
                AND sc.is_regular_class = true
              `;

    const selectedTermAndSem = isSemestralSubject(termSem);
    const semestralQueryParams = [selectedTermAndSem, schoolYear];

    // Add custodian-specific filtering
    if (userRole === 'Custodian') {
      orientationsQuery += ` AND lo.custodian_id = $6 `;
      queryParams.push(custodianId);

      pendingAcknowledgementQuery += ` AND lo.custodian_id = $2 `;
      countQueryParams.push(custodianId);

      // Add laboratory filtering for custodian if applicable
      if (selectedLaboratory.length > 0) {
        orientationsQuery += ` AND sc.laboratory = ANY($7) `;
        queryParams.push(selectedLaboratory);

        pendingAcknowledgementQuery += ` AND sc.laboratory = ANY($3) `;
        countQueryParams.push(selectedLaboratory);

        semestralSubjectsQuery += ` AND sc.laboratory = ANY($3) `;
        semestralQueryParams.push(selectedLaboratory);
      }
    } else if (selectedLaboratory.length > 0) {
      // Add laboratory filtering for admin if applicable
      orientationsQuery += ` AND sc.laboratory = ANY($6) `;
      queryParams.push(selectedLaboratory);

      pendingAcknowledgementQuery += ` AND sc.laboratory = ANY($2) `;
      countQueryParams.push(selectedLaboratory);

      semestralSubjectsQuery += ` AND sc.laboratory = ANY($3) `;
      semestralQueryParams.push(selectedLaboratory);
    }

    // Add grouping, sorting and pagination
    orientationsQuery += ` GROUP BY 
                lo.id, sy.school_year, 
                sc.laboratory, sc.sched_start_time, sc.sched_end_time,
                s.program,
                u.full_name, u.esign_url,
                i.full_name, i.esign_url
              ORDER BY 
                lo.subject_code, lo.id 
              LIMIT $4 
              OFFSET $5 `;

    // Execute all queries concurrently for better performance
    const [
      orientationsResult,
      totalCountResult,
      pendingAcknowledgementResult,
      semestralSubjectsResult,
    ] = await Promise.all([
      pool.query(orientationsQuery, queryParams),
      pool.query('SELECT COUNT(*) FROM laboratory_orientation', []),
      pool.query(pendingAcknowledgementQuery, countQueryParams),
      pool.query(semestralSubjectsQuery, semestralQueryParams),
    ]);

    // Process semestral subjects data
    const semestralSubjects = aggregateSemestralSubjects(
      semestralSubjectsResult.rows,
      selectedTermAndSem
    );

    // Check if there are more results available
    const hasMoreResults = orientationsResult.rows.length === limit;

    // Enrich orientation data with semestral flag
    const enrichedOrientations = orientationsResult.rows.map((row) => {
      const isSubjectSemestral =
        semestralSubjects.find((schedule) => schedule.code === row.code)
          ?.isSemestral || false;

      return { ...row, isSemestral: isSubjectSemestral };
    });

    return res.json({
      orientations: enrichedOrientations,
      hasMore: hasMoreResults,
      countResult: totalCountResult.rows[0].count,
      forAcknowledgementCount: pendingAcknowledgementResult.rows[0].count,
    });
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Getting laboratory orientation';
    next(err);
  }
}

/**
 * Retrieves a single laboratory orientation record
 *
 * @param {Object} req - Express request object with orientation details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with orientation details
 */
async function getsSingleLaboratoryOrientation(req, res, next) {
  const { full_name } = req.user;
  const { isSemestral, selectedTermAndSem, title, code, dateConducted } =
    req.body;

  // Handle term/semester for semestral subjects
  let termSemester = selectedTermAndSem;
  if (isSemestral) termSemester = isSemestralSubject(termSemester)[0];

  try {
    // Query to get detailed orientation data with related information
    let orientationQuery = `
        SELECT
          lo.*,
          s.students, s.program, s.term_sem, s.code, s.title,
          util.students_attendance,
          sy.school_year, 
          u.full_name AS custodian, u.esign_url AS custodian_esign,
          i.full_name AS instructor, i.esign_url AS instructor_esign
        FROM
          laboratory_orientation AS lo
        INNER JOIN
          schoolyear AS sy ON lo.school_year_id = sy.id
        INNER JOIN
          utilizations AS util ON lo.utilization_id = util.id
        INNER JOIN
          subjects AS s ON lo.instructor_id = s.instructor_id
        INNER JOIN
          users AS u ON lo.custodian_id = u.id
        INNER JOIN
          users AS i ON lo.instructor_id = i.id
        WHERE 
          lo.subject_code = $1 AND lo.subject_title = $2 AND s.term_sem = $3 AND lo.date_conducted = $4
        `;

    const queryParams = [code, title, termSemester, new Date(dateConducted)];
    const orientationResult = await pool.query(orientationQuery, queryParams);

    return res.json(orientationResult.rows[0]);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = `Getting single laboratory orientation :: user ${full_name}`;
    next(err);
  }
}

/**
 * Adds a single laboratory orientation record
 * Called internally from other functions
 *
 * @param {string} scheduleId - ID of the schedule
 * @param {string} utilizationId - ID of the utilization
 * @param {string} custodianId - ID of the custodian
 * @param {string} instructorId - ID of the instructor
 * @param {string} usageDate - Date of the orientation
 * @param {string} school_year_id - ID of the school year
 * @param {string} subjectCode - Code of the subject
 * @param {string} subjectTitle - Title of the subject
 * @param {Function} next - Express next middleware function
 */
async function addSingleLaboratoryOrientation(
  scheduleId,
  utilizationId,
  custodianId,
  instructorId,
  usageDate,
  school_year_id,
  subjectCode,
  subjectTitle,
  next
) {
  try {
    // Insert query for adding a new laboratory orientation
    const insertQuery = `
          INSERT INTO 
            laboratory_orientation
            (schedule_id, utilization_id, school_year_id, custodian_id, instructor_id, subject_title, subject_code, date_conducted)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)
          `;

    const queryParams = [
      scheduleId,
      utilizationId,
      school_year_id,
      custodianId,
      instructorId,
      subjectTitle,
      subjectCode,
      new Date(usageDate),
    ];

    await pool.query(insertQuery, queryParams);
  } catch (err) {
    // Log error and pass to error handler
    console.log('Adding Laboratory Orientation Error', err);
    next(err);
  }
}

/**
 * Updates multiple laboratory orientation records in batch
 *
 * @param {Object} req - Express request object with orientation details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function updateMultipleLaboratoryOrientation(req, res, next) {
  const {
    orientationsId, // Array of orientation IDs to update
    lab_safety_guidelines, // Safety guidelines flag
    lab_evac_plan, // Evacuation plan flag
    lab_emergency_drill, // Emergency drill flag
    status, // New status value
  } = req.body;

  const acknowledgedTimestamp = new Date();

  try {
    // Update query for multiple orientations
    await pool.query(
      `UPDATE laboratory_orientation 
       SET lab_safety_guidelines = $2, 
           lab_evac_plan = $3, 
           lab_emergency_drill = $4, 
           status = $5, 
           date_acknowledged = $6 
       WHERE id = ANY($1)`,
      [
        orientationsId,
        lab_safety_guidelines,
        lab_evac_plan,
        lab_emergency_drill,
        status,
        acknowledgedTimestamp,
      ]
    );
    res.status(200).json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Updating multiple laboratory orientations';
    next(err);
  }
}

/**
 * Updates a single laboratory orientation record
 *
 * @param {Object} req - Express request object with orientation details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function updateSingleLaboratoryOrientation(req, res, next) {
  const {
    orientationId, // ID of the orientation to update
    lab_safety_guidelines, // Safety guidelines flag
    lab_evac_plan, // Evacuation plan flag
    lab_emergency_drill, // Emergency drill flag
  } = req.body;

  try {
    // Update query for a single orientation
    await pool.query(
      `UPDATE laboratory_orientation 
       SET lab_safety_guidelines = $2, 
           lab_evac_plan = $3, 
           lab_emergency_drill = $4  
       WHERE id = $1`,
      [orientationId, lab_safety_guidelines, lab_evac_plan, lab_emergency_drill]
    );
    res.status(200).json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Updating single laboratory orientation';
    next(err);
  }
}

/**
 * Deletes a laboratory orientation record
 *
 * @param {Object} req - Express request object with orientation ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteLaboratoryOrientation(req, res, next) {
  const { user_role } = req.user;

  // Check if user has permission to delete orientations
  if (user_role !== 'Admin' && user_role !== 'Custodian') {
    return res
      .status(403)
      .send('User is not authorized to perform this action');
  }

  try {
    const { id } = req.params;

    // Delete the orientation record
    await pool.query('DELETE FROM laboratory_orientation WHERE id = $1', [id]);

    res.status(200).json();
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Deleting laboratory orientation';
    next(err);
  }
}

exports.addSingleLaboratoryOrientation = addSingleLaboratoryOrientation;
exports.getsSingleLaboratoryOrientation = getsSingleLaboratoryOrientation;
exports.updateMultipleLaboratoryOrientation =
  updateMultipleLaboratoryOrientation;
exports.updateSingleLaboratoryOrientation = updateSingleLaboratoryOrientation;
exports.getLaboratoryOrientation = getLaboratoryOrientation;
exports.deleteLaboratoryOrientation = deleteLaboratoryOrientation;
