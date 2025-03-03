const pool = require('../config/db.config');

/**
 * Recomputes the balance of stock card items after an update
 *
 * @param {string} tableName - The name of the table to update
 * @param {string} stockCardId - The ID of the stock card
 * @param {string} id - The ID of the item that was updated
 * @param {number} balance_diff - The difference in balance to apply
 */
async function recompute_balance(tableName, stockCardId, id, balance_diff) {
  // Determine whether to add or subtract based on the balance difference
  const operation = balance_diff > 0 ? '-' : '+';
  // Convert negative numbers to positive for the query
  const absoluteBalanceDiff = Math.abs(balance_diff);

  // Update all items with IDs greater than the current one in the same stock card
  await pool.query(
    `
    UPDATE
      ${tableName}
    SET
      item_balance = item_balance ${operation} $3
    WHERE
      id > $1
    AND
      stockcard_id = $2
    `,
    [id, stockCardId, absoluteBalanceDiff]
  );
}

/**
 * Updates stock card items when consumable items are released through a borrower slip
 *
 * @param {string} borrowerSlipId - The ID of the borrower slip
 * @param {string} instructorName - The name of the instructor who released the items
 * @param {Date} currentDate - The date when the items were released
 */
async function update_stockcard_items_tru_released_borrower_slip(
  borrowerSlipId,
  instructorName,
  currentDate
) {
  // Query to fetch all consumable items to be released from the borrower slip
  const query = ` 
        SELECT 
          temp.stockcard_item_id, temp.item_quantity, slr.item_balance AS item_balance
        FROM 
          borrower_slip_lab_temporary_records AS temp
        INNER JOIN
          stockcard AS s ON temp.stockcard_item_id = s.id
        INNER JOIN
          stockcard_laboratory_released AS slr ON s.id = slr.stockcard_id 
        WHERE
          temp.borrower_slip_id = $1 
        AND
          s.item_category = 'Consumable'
        `;

  const values = [borrowerSlipId];

  // Fetch all consumable items to be released
  const releasedConsumableItems = await pool.query(query, values);

  // Update the balance for each consumable item
  if (releasedConsumableItems.rows.length > 0) {
    for (const item of releasedConsumableItems.rows) {
      // Insert a new record for each released item
      const insertQuery = `
      INSERT INTO
        stockcard_laboratory_released (stockcard_id, item_balance, item_released, released_to, date_released)
      VALUES
        ($1, $2, $3, $4, $5)
      `;

      // Calculate the new balance by subtracting the released quantity
      const insertValues = [
        item.stockcard_item_id,
        Number(item.item_balance) - Number(item.item_quantity),
        Number(item.item_quantity),
        instructorName,
        currentDate,
      ];

      await pool.query(insertQuery, insertValues);
    }
  }

  // Create an array of consumable item IDs for deletion
  const consumableItemsId = [];
  releasedConsumableItems.rows.map((item) =>
    consumableItemsId.push(item.stockcard_item_id)
  );

  // Delete the temporary records for the released consumable items
  await pool.query(
    `DELETE FROM borrower_slip_lab_temporary_records WHERE borrower_slip_id = $1 AND stockcard_item_id = ANY($2)`,
    [borrowerSlipId, consumableItemsId]
  );
}

/**
 * Updates stock card items when items are returned with damage through a borrower slip
 *
 * @param {string} borrowerSlipId - The ID of the borrower slip
 * @param {string} instructorName - The name of the instructor who returned the items
 * @param {Date} currentDate - The date when the items were returned
 */
async function update_stockcard_items_tru_returned_borrower_slip(
  borrowerSlipId,
  instructorName,
  currentDate
) {
  // Query to fetch all damaged materials after returning
  const query = ` 
        SELECT 
          stockcard_item_id, item_damaged_quantity
        FROM 
          borrower_slip_lab_items
        WHERE
          borrower_slip_id = $1 
        AND
          returned_status = '2' 
        AND
          item_type = 'materials'
        `;

  const values = [borrowerSlipId];

  // Fetch all damaged items after returning
  const damagedItems = await pool.query(query, values);

  if (damagedItems.rows.length > 0) {
    // Create an array of damaged item IDs
    const damagedItemsId = [];
    damagedItems.rows.map((item) =>
      damagedItemsId.push(item.stockcard_item_id)
    );

    // Fetch the current stock card information for the damaged items
    const selectedStockCardItems = await pool.query(
      `
    SELECT 
      stockcard_id, item_balance, item_released, released_to, date_released
    FROM 
      stockcard_laboratory_released WHERE stockcard_id = ANY($1)
    `,
      [damagedItemsId]
    );

    // Update the balance for each damaged reusable item
    for (const stockCardItem of selectedStockCardItems.rows) {
      // Find the corresponding damaged item record
      const damagedItemRecord = damagedItems.rows.find(
        (damagedItem) =>
          damagedItem.stockcard_item_id === stockCardItem.stockcard_id
      );

      // Insert a new record for each damaged item
      const insertQuery = `
        INSERT INTO
          stockcard_laboratory_released (stockcard_id, item_balance, item_released, released_to, date_released)
        VALUES
          ($1, $2, $3, $4, $5)
      `;

      // Calculate the new balance by subtracting the damaged quantity
      const insertValues = [
        stockCardItem.stockcard_id,
        Number(stockCardItem.item_balance) -
          Number(damagedItemRecord.item_damaged_quantity),
        Number(damagedItemRecord.item_damaged_quantity),
        instructorName,
        currentDate,
      ];

      await pool.query(insertQuery, insertValues);
    }
  }

  // Create an array of reusable item IDs for deletion
  const reusableItemsId = [];
  damagedItems.rows.map((item) => reusableItemsId.push(item.stockcard_item_id));

  // Delete the temporary records for the returned reusable items
  await pool.query(
    `DELETE FROM borrower_slip_lab_temporary_records WHERE borrower_slip_id = $1 AND stockcard_item_id = ANY($2)`,
    [borrowerSlipId, reusableItemsId]
  );
}

exports.recompute_balance = recompute_balance;

exports.update_stockcard_items_tru_released_borrower_slip =
  update_stockcard_items_tru_released_borrower_slip;

exports.update_stockcard_items_tru_returned_borrower_slip =
  update_stockcard_items_tru_returned_borrower_slip;
