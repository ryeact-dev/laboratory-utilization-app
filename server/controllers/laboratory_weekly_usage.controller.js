const pool = require('../config/db.config');
const { userRoleStep } = require('../util/userRoleStep');

const socketMiddleware = require('../middlewares/socketIo');

/**
 * Retrieves a paginated list of laboratory weekly reports
 *
 * @param {Object} req - Express request object with user and query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of laboratory reports and pagination info
 */
async function getPaginatedLaboratoryReports(req, res, next) {
  const {
    user_role: userRole,
    laboratory,
    id: userId,
    user_program: userProgram,
  } = req.user;

  // Only Program Heads can access this endpoint
  if (userRole !== 'Program Head')
    return res.status(401).send('Unauthorized User');

  try {
    let {
      page,
      perpage,
      wasAcknowledged,
      termsem,
      laboratory: selectedLab,
    } = req.query;

    // Ensure page number is not negative
    if (Number(page) < 0) page = 0;
    perpage = Number(perpage);
    page = Number(page);

    // Base query to retrieve laboratory weekly usage reports
    let query = `
        SELECT
          lwu.id,
          lwu.step,
          lwu.prog_head_acknowledged,
          lwu.prog_head_id,
          lwu.programs,
          lwu.laboratory,
          lwu.selected_date,
          lwu.created_at,
          lwu.week_number,
          lwu.term_sem,
          c.full_name AS custodian, c.esign_url AS custodian_esign,
          d.full_name AS dean, d.esign_url AS dean_esign
        FROM
          laboratory_weekly_usage AS lwu
        INNER JOIN
          users AS c ON lwu.custodian_id = c.id
        LEFT JOIN
          users AS d ON lwu.dean_id = d.id
        WHERE
          lwu.term_sem = $1 `;

    // Query to count reports for acknowledgment
    const countQuery = `
    SELECT
      COUNT(*) 
    FROM
      laboratory_weekly_usage
    WHERE
     step = $1 AND term_sem = $2
    `;

    const values = [termsem, page, perpage];
    const countValues = [[1], termsem];

    // Filter by acknowledgment status if specified
    if (wasAcknowledged === 'true') {
      query += ` AND $4 = ANY(lwu.prog_head_id) AND $5 = ANY(lwu.programs) `;
      values.push([userId], userProgram);

      // Filter by selected laboratory if specified
      if (!!selectedLab) {
        query += ` AND lwu.laboratory = $6 `;
        values.push(selectedLab);
      } else {
        query += ` AND lwu.laboratory = ANY($6) `;
        values.push(laboratory);
      }
    } else {
      query += ` AND lwu.prog_head_id = '{}' AND lwu.laboratory = ANY($4) `;
      values.push(laboratory);
    }

    // Order results by selected date and apply pagination
    query += ` ORDER BY lwu.selected_date LIMIT $2 OFFSET $3`;

    // Execute both queries concurrently
    const resultPromise = pool.query(query, values);
    const countResultPromise = pool.query(countQuery, countValues);

    console.log(query, values);
    console.log(countQuery, countValues);

    const [result, countResult] = await Promise.all([
      resultPromise,
      countResultPromise,
    ]);

    // Determine if there are more results for pagination
    const hasMore = result.rows.length === perpage;

    return res.json({
      reports: result.rows,
      hasMore,
      countResult: countResult.rows[0].count,
    });
  } catch (err) {
    err.title = 'Fetch Laboratory Weekly Reports';
    next(err);
  }
}

/**
 * Retrieves the step status for a specific subject and week dates
 *
 * @param {Object} req - Express request object with subject ID and week dates
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the step status
 */
async function getStepStatus(req, res, next) {
  const { subjectId, weekDates } = req.body;

  try {
    // Query to get the step status for the specified subject and week dates
    const stepStatus = await pool.query(
      `SELECT step FROM laboratory_weekly_usage WHERE subject_id = $1 AND weekdates @> $2`,
      [subjectId, weekDates]
    );

    res.json(stepStatus.rows);
  } catch (err) {
    err.title = 'Getting step status';
    next(err);
  }
}

/**
 * Adds a new laboratory weekly utilization report
 *
 * @param {Object} req - Express request object with user ID and report details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function addLaboratoryWeeklyUtilizations(req, res, next) {
  const { user_role: userRole, id: custodianId } = req.user;

  // Only Custodians can add reports
  if (userRole !== 'Custodian')
    return res.status(401).send('Unauthorized user');

  const { laboratory, selectedDate, selectedTermAndSem, weekNumber } = req.body;

  try {
    // Check if a report for the same laboratory and date already exists
    const foundReport = await pool.query(
      `SELECT id FROM laboratory_weekly_usage WHERE laboratory = $1 AND selected_date = $2`,
      [laboratory, selectedDate]
    );

    if (foundReport.rows.length > 0)
      return res.status(409).send('Report(s) already submitted');

    // Prepare columns and values for insertion
    const columns = [
      'laboratory',
      'selected_date',
      'custodian_id',
      'week_number',
      'term_sem',
      'step',
      'prog_head_acknowledged',
      'prog_head_id',
      'programs',
    ];

    const values = [
      laboratory,
      selectedDate,
      custodianId,
      weekNumber,
      selectedTermAndSem,
      [],
      [],
      [],
      [],
    ];

    const columnNames = columns.join(', ');
    const placeHolders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new report into the database
    const query = `INSERT INTO laboratory_weekly_usage (${columnNames}) VALUES (${placeHolders})`;
    await pool.query(query, values);

    // Notify connected clients about the new report
    const io = socketMiddleware.getIO();
    io.emit('report:laboratory-utilizations');

    res.status(200).send('Laboratory Utilizations submitted successfully');
  } catch (err) {
    err.title = 'Adding Laboratory Utilizations Report';
    next(err);
  }
}

/**
 * Updates the step status of a laboratory report
 *
 * @param {Object} req - Express request object with user ID and report details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function updateLabReportStepStatus(req, res, next) {
  const {
    user_role: userRole,
    id: userId,
    user_program: userProgram,
  } = req.user;

  const { report, deanId } = req.body;

  // Only Program Heads and Deans can update report statuses
  if (userRole !== 'Program Head' && userRole !== 'Dean')
    return res.status(401).send('Unauthorized user');

  const {
    id,
    step,
    prog_head_acknowledged,
    prog_head_id,
    programs,
    laboratory,
    selected_date,
  } = report;

  // Mutate the arrays to include the current user's role and acknowledgment
  step.push(userRoleStep(userRole));
  prog_head_acknowledged.push(new Date());
  prog_head_id.push(userId);
  programs.push(userProgram);

  try {
    // Check if the report has already been acknowledged by the user
    const foundReport = await pool.query(
      `SELECT id FROM laboratory_weekly_usage WHERE laboratory = $1 AND selected_date = $2 AND $3 = ANY(prog_head_id)`,
      [laboratory, selected_date, userId]
    );

    if (foundReport.rows.length > 0)
      return res.status(409).send('Report already acknowledged');

    // Prepare the update query
    let query = `UPDATE laboratory_weekly_usage SET step = $2 `;
    let values = [id, step];

    // Update fields based on user role
    if (userRole === 'Program Head') {
      query += `, prog_head_acknowledged = $3, prog_head_id = $4, programs  = $5 , dean_id = $6 `;
      values.push(prog_head_acknowledged, prog_head_id, programs, deanId);
    } else if (userRole === 'Dean') {
      query += `, dean_acknowledged = $3 `;
      values.push(new Date());
    } else return res.status(401).send('Unauthorized request.');

    query += ' WHERE id = $1';
    await pool.query(query, values);

    res.status(200).send(`${laboratory} Report has been acknowledged`);
  } catch (err) {
    err.title = 'Updating Laboratory Report';
    next(err);
  }
}

/**
 * Updates multiple laboratory weekly reports' statuses
 *
 * @param {Object} req - Express request object with user ID and report IDs
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function updateManyLabWeeklyReports(req, res, next) {
  const {
    user_role: userRole,
    id: userId,
    user_program: userProgram,
  } = req.user;
  const { reportIds, deanId } = req.body;

  // Only Program Heads and Deans can update report statuses
  if (userRole !== 'Program Head' && userRole !== 'Dean')
    return res.status(401).send('Unauthorized user');

  try {
    // Retrieve the reports to be updated
    const foundReports = await pool.query(
      'SELECT * FROM laboratory_weekly_usage WHERE id = ANY($1)',
      [reportIds]
    );

    // Loop through each report and update its status
    for (let i = 0; i < foundReports.rows.length; i++) {
      const { id, step, prog_head_acknowledged, prog_head_id, programs } =
        foundReports.rows[i];

      // Mutate the arrays to include the current user's role and acknowledgment
      step.push(userRoleStep(userRole));
      prog_head_acknowledged.push(new Date());
      prog_head_id.push(userId);
      programs.push(userProgram);

      let query = `UPDATE laboratory_weekly_usage SET step = $2`;
      let values = [id, step];

      // Update fields based on user role
      if (userRole === 'Program Head') {
        query += `, prog_head_acknowledged = $3, prog_head_id = $4, programs  = $5 , dean_id = $6 `;
        values.push(prog_head_acknowledged, prog_head_id, programs, deanId);
      } else if (userRole === 'Dean') {
        query += `, dean_acknowledged = $3 `;
        values.push(new Date());
      } else return res.status(401).send('Unauthorized request.');

      query += ' WHERE id = $1';

      await pool.query(query, values);
    }

    res.json(`Updated ${reportIds.length} reports successfully`);
  } catch (err) {
    err.title = 'Update many reports';
    next(err);
  }
}

exports.getPaginatedLaboratoryReports = getPaginatedLaboratoryReports;
exports.addLaboratoryWeeklyUtilizations = addLaboratoryWeeklyUtilizations;
exports.getStepStatus = getStepStatus;
exports.updateLabReportStepStatus = updateLabReportStepStatus;
exports.updateManyLabWeeklyReports = updateManyLabWeeklyReports;
