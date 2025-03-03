const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { verifyLaboratories } = require('../util/verifyLaboratories');
const { logger } = require('../util/winstonLogger');
const { dateConverter } = require('../util/dateConverter');
const readXlsxFile = require('read-excel-file/node');

/**
 * Retrieves a paginated list of hardware for a selected laboratory
 *
 * @param {Object} req - Express request object containing query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of hardware and pagination info
 */
async function getPaginatedHardwareList(req, res, next) {
  let { schoolyear, laboratory, page, perpage, propertyno = '' } = req.query;

  // Ensure the page number is not negative
  if (page < 0) page = 0;
  perpage = Number(perpage);
  const limit = 300;

  // Verify if the user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  try {
    await pool.query('BEGIN');

    // Base query to retrieve hardware for the specified laboratory
    let query = `
        SELECT 
            h.*,
            ARRAY_AGG(DISTINCT s.title) FILTER (WHERE s.id IS NOT NULL) AS softwares_installed,
            ARRAY_AGG(DISTINCT jsonb_build_object('upgrade_details', hu.upgrade_details, 'date_upgraded', hu.date_upgraded)) 
                FILTER (WHERE hu.id IS NOT NULL) AS hardware_upgrades
        FROM hardware h
        LEFT JOIN UNNEST(h.softwares_uuid) AS sw_id ON TRUE
        LEFT JOIN software s ON s.id = sw_id AND s.school_year = $4
        LEFT JOIN hardware_upgrades hu ON hu.hardware_id = h.id
        WHERE h.laboratory = $1
    `;

    let values = [laboratory, limit, 0, schoolyear];

    // Filter by property number if provided
    if (propertyno.trim() !== '') {
      query += ` AND h.property_number LIKE $5 || '%' `;
      values.push(propertyno.toUpperCase());
    }

    // Group by hardware id to aggregate software titles and upgrades
    query += `
        GROUP BY h.id
        ORDER BY h.property_number
        LIMIT $2 OFFSET $3
    `;

    const listOfHardwares = await pool.query(query, values);

    // Process the results to ensure proper formatting
    const hardwareList = listOfHardwares.rows.map((hardware) => {
      // Convert empty arrays to proper empty arrays (in case of NULL)
      const softwares_installed = hardware.softwares_installed || [];

      // Filter out null values from hardware_upgrades and sort by date
      const hardware_upgrades = (hardware.hardware_upgrades || [])
        .filter((upgrade) => upgrade !== null)
        .sort((a, b) => new Date(b.date_upgraded) - new Date(a.date_upgraded));

      return {
        ...hardware,
        softwares_installed,
        hardware_upgrades,
      };
    });

    await pool.query('COMMIT');

    // Calculate the start index and end index for the current page
    const startIndex = page * Number(perpage);
    const endIndex = startIndex + Number(perpage);

    // Get the paginated results for the current page
    const paginatedList = Number(perpage)
      ? hardwareList.slice(startIndex, endIndex)
      : hardwareList;

    const hasMore =
      endIndex === Number(limit) || hardwareList.length <= endIndex;

    res.json({ list: paginatedList, hasMore });
  } catch (err) {
    await pool.query('ROLLBACK');
    err.title = 'Fetching hardware list';
    next(err);
  }
}

/**
 * Retrieves a list of system units for a selected laboratory
 *
 * @param {Object} req - Express request object containing query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of system units
 */
async function getSystemUnitList(req, res, next) {
  const { laboratory } = req.query;

  try {
    // Query to retrieve system units for the specified laboratory
    let query = `
        SELECT * 
        FROM  hardware 
        WHERE laboratory = $1 AND hardware_type LIKE 'system unit'
        ORDER BY date_acquired DESC
          `;

    const values = [laboratory];

    const systemUnitList = await pool.query(query, values);

    // If system unit records are found, fetch associated upgrades
    if (systemUnitList.rows.length > 0) {
      for (let x = 0; x < systemUnitList.rows.length; x++) {
        // Fetch hardware upgrades
        const hardwareUpgrades = await pool.query(
          'SELECT upgrade_details, date_upgraded FROM hardware_upgrades WHERE hardware_id = $1 ORDER BY date_upgraded DESC',
          [systemUnitList.rows[x].id]
        );

        // Update the system unit record with upgrade details
        systemUnitList.rows[x] = {
          ...systemUnitList.rows[x],
          hardware_upgrades: hardwareUpgrades.rows,
        };
      }
    }

    res.json(systemUnitList.rows);
  } catch (err) {
    err.title = 'Fetching system unit list';
    next(err);
  }
}

/**
 * Adds a new hardware item to the list
 *
 * @param {Object} req - Express request object containing hardware details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function addLaboratoryHardware(req, res, next) {
  const {
    laboratory,
    property_number,
    date_acquired,
    specs,
    hardware_type,
    softwares_uuid = [],
  } = req.body;

  // Check if the property number starts with 'TA'
  const propertyNumberChecker = property_number.toString().slice(0, 2);

  if (propertyNumberChecker.toUpperCase() !== 'TA')
    return res.status(422).send('Property number must start with TA');

  const currentDate = new Date();

  // Users can only add hardware acquired before or on the current date
  const validDate =
    currentDate < new Date(date_acquired) ? currentDate : date_acquired;

  try {
    const id = uuidv4();
    const createdAt = currentDate;

    // Prepare columns and values for insertion
    const columns = [
      'id',
      'property_number',
      'hardware_type',
      'specs',
      'softwares_uuid',
      'date_acquired',
      'laboratory',
      'created_at',
    ];
    const values = [
      id,
      property_number.toUpperCase(),
      hardware_type.toLowerCase(),
      specs,
      softwares_uuid,
      validDate,
      laboratory,
      createdAt,
    ];

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new hardware into the database
    const query = `
          INSERT INTO 
              hardware (${columnNames}) 
          VALUES 
              (${placeholders}) 
          `;

    await pool.query(query, values);

    res.status(200).send('Hardware added successfully');
  } catch (err) {
    // Handle unique constraint violation for property number
    if (err.constraint) {
      return res.status(403).send('Property Number already exists on the list');
    }
    err.title = 'Adding hardware on list';
    next(err);
  }
}

/**
 * Adds multiple hardware items in bulk from an Excel file
 *
 * @param {Object} req - Express request object containing file and user details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with duplicates and count of added items
 */
async function addBulkHardwares(req, res, next) {
  const rows = await readXlsxFile(req.file.path);
  const { addedBy, laboratory } = req.body;
  const duplicates = [];
  let count = 0;

  try {
    // Temporarily set softwares_uuid to empty array
    const softwares_uuid = [];

    for (let i = 1; i < rows.length; i++) {
      const [property_number, hardware_type, specs, date_acquired] = rows[i];

      // Check if the inputted property number starts with TA
      const propertyNumberChecker = property_number.toString().slice(0, 2);
      if (propertyNumberChecker.toUpperCase() !== 'TA') break;

      // Check for duplicates in the database
      const { rows: duplicateRows } = await pool.query(
        'SELECT property_number FROM hardware WHERE property_number = $1 AND laboratory = $2',
        [property_number.toUpperCase(), laboratory]
      );

      if (duplicateRows.length > 0) {
        duplicates.push(property_number);
      } else {
        const id = uuidv4();
        const createdAt = new Date();

        // Users can only add hardware acquired before or on the current date
        const validDate =
          createdAt < new Date(date_acquired)
            ? createdAt
            : new Date(date_acquired);

        // Prepare columns and values for insertion
        const columns = [
          'id',
          'property_number',
          'hardware_type',
          'specs',
          'softwares_uuid',
          'date_acquired',
          'laboratory',
          'created_at',
        ];
        const values = [
          id,
          property_number.toUpperCase(),
          hardware_type.toLowerCase(),
          specs,
          softwares_uuid,
          validDate,
          laboratory,
          createdAt,
        ];

        const columnNames = columns.join(', ');
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

        // Insert the new hardware into the database
        const query = `INSERT INTO hardware (${columnNames}) VALUES (${placeholders})`;
        await pool.query(query, values);

        count++;
      }
    }
    res.json({ duplicates, count });
    logger.info(
      `Bulk hardwares successfully registered by ${addedBy} :: ${dateConverter()}`
    );
  } catch (err) {
    err.title = 'Adding bulk hardwares';
    next(err);
  }
}

/**
 * Updates an existing hardware item in the list
 *
 * @param {Object} req - Express request object containing hardware details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function updateLaboratoryHardware(req, res, next) {
  const {
    id,
    property_number,
    date_acquired,
    specs,
    softwares_uuid = [],
    hardware_type,
  } = req.body;

  try {
    // Prepare the update query
    const query = `
          UPDATE 
            hardware
          SET 
            property_number = $1, 
            specs = $2, 
            softwares_uuid = $3, 
            date_acquired = $4, 
            hardware_type = $5
          WHERE 
            id = $6
          `;

    const values = [
      property_number.toUpperCase(),
      specs,
      softwares_uuid,
      date_acquired,
      hardware_type.toLowerCase(),
      id,
    ];

    await pool.query(query, values);
    res.status(200).send('Hardware updated successfully');
  } catch (err) {
    err.title = 'Updating hardware on list';
    next(err);
  }
}

/**
 * Deletes a hardware item from the list
 *
 * @param {Object} req - Express request object containing hardware ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function deleteLaboratoryHardware(req, res, next) {
  const { full_name } = req.user;
  const { hardwareId } = req.params;

  try {
    // Delete the specified hardware from the database
    const deletedPropertyNumber = await pool.query(
      `DELETE FROM hardware WHERE id = $1 RETURNING *`,
      [hardwareId]
    );

    const propertyNumber = deletedPropertyNumber.rows[0].property_number;

    // Log the deletion action
    logger.info(
      `${full_name} deleted a hardware with a property number of ${propertyNumber}`
    );
    res.json();
  } catch (err) {
    err.title = 'Deleting hardware on list';
    next(err);
  }
}

exports.getSystemUnitList = getSystemUnitList;
exports.getPaginatedHardwareList = getPaginatedHardwareList;
exports.addLaboratoryHardware = addLaboratoryHardware;
exports.addBulkHardwares = addBulkHardwares;
exports.updateLaboratoryHardware = updateLaboratoryHardware;
exports.deleteLaboratoryHardware = deleteLaboratoryHardware;
