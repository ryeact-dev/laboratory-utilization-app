const pool = require('../config/db.config');
const { verifyLaboratories } = require('../util/verifyLaboratories');
const { logger } = require('../util/winstonLogger');

/**
 * Retrieves all hardware upgrades for a selected hardware item
 *
 * @param {Object} req - Express request object containing hardware ID and laboratory
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with the list of hardware upgrades
 */
async function getHardwareUpgrades(req, res, next) {
  let { hardwareId, laboratory } = req.query;

  // Verify if the user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  try {
    // Query to retrieve upgrades for the specified hardware
    const upgradeList = await pool.query(
      'SELECT * FROM hardware_upgrades WHERE hardware_id = $1',
      [hardwareId]
    );

    res.json(upgradeList.rows);
  } catch (err) {
    err.title = 'Fetching Hardware Upgrades';
    next(err);
  }
}

/**
 * Adds a new hardware upgrade to the list
 *
 * @param {Object} req - Express request object containing upgrade details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function addHardwareUpgrades(req, res, next) {
  const { laboratory, ...upgradeDetails } = req.body;

  // Verify if the user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  const currentDate = new Date();

  try {
    // Prepare columns and values for insertion
    const columns = [];
    for (const name in upgradeDetails) {
      columns.push(`${name}`);
    }

    const values = [];
    for (const name in upgradeDetails) {
      values.push(upgradeDetails[name]);
    }

    // Add created_at timestamp to the columns and values
    columns.push('created_at');
    values.push(currentDate);

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert the new hardware upgrade into the database
    const query = `
          INSERT INTO 
              hardware_upgrades (${columnNames}) 
          VALUES 
              (${placeholders}) 
          `;

    await pool.query(query, values);

    res.status(200).send('Hardware Upgrade added successfully');
  } catch (err) {
    err.title = 'ADD Hardware Upgrades';
    next(err);
  }
}

/**
 * Updates an existing hardware upgrade in the list
 *
 * @param {Object} req - Express request object containing upgrade details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function updateHardwareUpgrades(req, res, next) {
  const {
    laboratory,
    upgrade_id,
    date_upgraded,
    upgrade_details,
    hardware_id,
  } = req.body;

  // Verify if the user has access to the specified laboratory
  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  const currentDate = new Date();

  try {
    // Prepare columns and values for the update
    const columns = [
      'date_upgraded',
      'upgrade_details',
      'hardware_id',
      'created_at',
    ];

    const values = [
      new Date(date_upgraded),
      upgrade_details,
      hardware_id,
      currentDate,
      upgrade_id,
    ];

    // Create the SET clause for the update query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    // Update the hardware upgrade in the database
    const query = `UPDATE hardware_upgrades SET ${setValues} WHERE id = $5`;
    await pool.query(query, values);

    res.status(200).send('Hardware Upgrade updated successfully');
  } catch (err) {
    err.title = 'UPDATE Hardware Upgrades';
    next(err);
  }
}

/**
 * Deletes a hardware upgrade from the list
 *
 * @param {Object} req - Express request object containing upgrade ID and property number
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response indicating success
 */
async function deleteHardwareUpgrades(req, res, next) {
  const { full_name } = req.user;
  const { id, propertyNumber } = req.body;

  try {
    // Delete the specified hardware upgrade from the database
    await pool.query(`DELETE FROM hardware_upgrades WHERE id = $1`, [id]);
    logger.info(
      `${full_name} deleted a hardware upgrade from ${propertyNumber}`
    );
    res.json();
  } catch (err) {
    err.title = 'Deleting hardware upgrades on list';
    next(err);
  }
}

exports.getHardwareUpgrades = getHardwareUpgrades;
exports.addHardwareUpgrades = addHardwareUpgrades;
exports.updateHardwareUpgrades = updateHardwareUpgrades;
exports.deleteHardwareUpgrades = deleteHardwareUpgrades;
