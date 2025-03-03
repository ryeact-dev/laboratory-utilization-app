const pool = require('../config/db.config');
const { recompute_balance } = require('../util/update_stockcard_items');

/**
 * Retrieves paginated stock card items with calculated balance
 *
 * @param {Object} req - Express request object with query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with items, balance, and pagination info
 */
async function getPaginatedStockCardItems(req, res, next) {
  const { stockcard_id, page, limit, category } = req.query;

  try {
    // Ensure page is not negative
    if (Number(page) < 0) page = 0;

    // Query to get total received items for the stock card
    const totalReceivedQuery = pool.query(
      `     
        SELECT
          s.id, s.item_name, SUM(so.item_received) AS item_received
        FROM 
          stockcard AS s
        LEFT JOIN
          stockcard_${category} AS so ON s.id = so.stockcard_id  
        WHERE 
          s.id = $1 
       ${
         // Only include items with PRS number for office and laboratory categories
         category !== 'office' && category !== 'laboratory'
           ? ''
           : 'AND so.prs_number IS NOT NULL'
       }
        GROUP BY
          s.id`,
      [stockcard_id]
    );

    // Query to get total released items for the stock card
    const totalReleasedQuery = pool.query(
      `     
        SELECT
          s.id AS secondary_id, SUM(so.item_released) AS item_released
        FROM 
          stockcard AS s
        LEFT JOIN
          stockcard_${category} AS so ON s.id = so.stockcard_id  
        WHERE 
          s.id = $1 
        AND
          so.prs_number IS NULL  
        GROUP BY
          s.id`,
      [stockcard_id]
    );

    // Query to get paginated stock card items
    const stockCardItemsQuery = pool.query(
      `
        SELECT
          s.*, so.id AS stockcard_released_id
        FROM
          stockcard_${category} AS s
        LEFT JOIN
          stockcard_laboratory_released AS so ON s.id = so.stockcard_laboratory_id
        WHERE 
          s.stockcard_id = $1
        ORDER BY 
          id DESC
        LIMIT $2 
        OFFSET $3
          `,
      [stockcard_id, Number(limit), page * Number(limit)]
    );

    // Execute all queries concurrently for better performance
    const [totalReceivedResult, totalReleasedResult, stockCardItemsResult] =
      await Promise.all([
        totalReceivedQuery,
        totalReleasedQuery,
        stockCardItemsQuery,
      ]);

    // Check if there are more items for pagination
    const hasMoreItems = stockCardItemsResult.rows.length === Number(limit);

    // Calculate total balance (received - released)
    const stockCardTotalBalance = totalReleasedResult.rows[0]?.item_released
      ? Number(totalReceivedResult.rows[0]?.item_received) -
        Number(totalReleasedResult.rows[0]?.item_released)
      : totalReceivedResult.rows[0]?.item_received;

    // Return response with items, balance, and pagination info
    res.json({
      stockCardTotalBalance: stockCardTotalBalance || 0,
      items: stockCardItemsResult.rows,
      hasMore: hasMoreItems,
    });
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'GET Stock Card Items';
    next(err);
  }
}

/**
 * Adds new items to a stock card
 *
 * @param {Object} req - Express request object with item details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function addStockCardItems(req, res, next) {
  const { item_name, category, isLaboratoryReleased, ...itemData } = req.body;

  try {
    // Prepare columns and values for insertion
    const columns = Object.keys(itemData);
    let values = Object.values(itemData);

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Begin transaction
    await pool.query('BEGIN');

    // Insert stock card item into appropriate category table
    const addedItemResult = await pool.query(
      `INSERT INTO stockcard_${category} (${columnNames}) VALUES (${placeholders}) RETURNING id`,
      values
    );

    // If this is a laboratory released item, create corresponding record
    if (isLaboratoryReleased) {
      const addedItemId = addedItemResult.rows[0].id;
      const { date_released, item_released, stockcard_id } = req.body;

      // Define columns for laboratory released record
      const releasedColumns = [
        'date_received',
        'item_received',
        'item_balance',
        'stockcard_id',
        'stockcard_laboratory_id',
      ];

      // Define values for laboratory released record
      const releasedValues = [
        date_released,
        item_released,
        item_released,
        stockcard_id,
        addedItemId,
      ];

      const releasedColumnNames = releasedColumns.join(', ');
      const releasedPlaceholders = releasedColumns
        .map((_, i) => `$${i + 1}`)
        .join(', ');

      // Insert laboratory released record
      await pool.query(
        `INSERT INTO stockcard_laboratory_released (${releasedColumnNames}) VALUES (${releasedPlaceholders}) `,
        releasedValues
      );
    }

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send(`${item_name}'s items added successfully`);
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'ADDING Stock Card Items';
    next(err);
  }
}

/**
 * Updates existing stock card items
 *
 * @param {Object} req - Express request object with updated details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateStockCardItems(req, res, next) {
  const {
    item_name,
    id,
    category,
    date_received,
    date_requested,
    date_released,
    isLaboratoryReleased,
    current_item_received,
    stockcard_released_id,
    ...updateData
  } = req.body;

  // Extract values needed for balance calculation
  const newItemReceived = req.body.item_received;
  const newItemReleased = req.body.item_released;

  // Calculate balance difference for recomputation
  let balanceDifference = 0;

  // Only proceed with recomputation if the new values are different from current
  if (Number(newItemReleased) !== 0) {
    // For released items, calculate difference between current and new released amount
    balanceDifference = Number(current_item_received) - Number(newItemReleased);
  }
  // If item_received is '0' means item to update is released
  if (Number(newItemReceived) === 0) {
    balanceDifference = Number(newItemReleased) - Number(current_item_received);
  }
  // If item_received is not '0', calculate difference for received items
  if (Number(newItemReceived) !== 0) {
    balanceDifference = Number(current_item_received) - Number(newItemReceived);
  }

  try {
    // Prepare columns and values for update
    const columns = Object.keys(updateData);
    const values = Object.values(updateData);

    // Add date fields if provided
    if (date_received) {
      columns.push('date_received');
      values.push(new Date(date_received));
    }

    if (date_requested) {
      columns.push('date_requested');
      values.push(new Date(date_requested));
    }

    if (date_released) {
      columns.push('date_released');
      values.push(new Date(date_released));
    }

    // Add ID as the last parameter
    values.push(id);

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    let updateQuery = `UPDATE stockcard_${category} SET ${setValues} WHERE id = $${values.length}`;

    // Begin transaction
    await pool.query('BEGIN');

    // Update stock card item
    await pool.query(updateQuery, values);

    // *ACTIVATE THIS IF YOU WANT TO CHECK IF ITEM BALANCE IS NEGATIVE
    // const { rows } = await pool.query(
    //   `
    //   SELECT item_balance
    //   FROM stockcard_${category}
    //   WHERE stockcard_id = $1
    //   ORDER BY created_at DESC
    //   LIMIT 1
    //   `,
    //   [req.body.stockcard_id]
    // );

    // const isOutOfBalance = rows[0].item_balance < balance_diff;

    // if (isOutOfBalance) {
    //   return res
    //     .status(400)
    //     .send('Updating this balance will result to negative balance');
    // }

    // Recompute balance if there's a difference
    const stockCardId = req.body.stockcard_id;
    if (balanceDifference !== 0) {
      await recompute_balance(
        `stockcard_${category}`,
        stockCardId,
        id,
        balanceDifference
      );
    }

    // TODO: FIX THIS ITEM BALANCE, ITEM RECIEVED AND ITEM RELEASED (FIX ALREADY BUT NEED TO OBSERVE THE RESULT)
    // If Laboratory Released update the stockcard_laboratory_released table
    if (isLaboratoryReleased) {
      const { date_released, item_balance, item_released, released_to } =
        req.body;

      // Define columns for laboratory released update
      const releasedColumns = [
        'date_received',
        'item_received',
        'item_balance',
        'released_to',
        'id',
      ];

      // Define values for laboratory released update
      const releasedValues = [
        date_released,
        item_released,
        item_balance,
        released_to,
        stockcard_released_id,
      ];

      // Prepare column names array
      const releasedColumnNames = [];
      for (const name in releasedColumns) {
        releasedColumnNames.push(`${name}`);
      }

      // Prepare values array
      const releasedValueNames = [];
      for (const name in releasedValues) {
        releasedValueNames.push(releasedValues[name]);
      }

      // Prepare SET clause for UPDATE query
      const releasedSetValues = releasedColumns
        .map((column, i) => `${column} = $${i + 1}`)
        .join(', ');

      // Update laboratory released record
      let releasedUpdateQuery = `UPDATE stockcard_laboratory_released SET ${releasedSetValues} WHERE id = $${releasedValues.length}`;
      await pool.query(releasedUpdateQuery, releasedValues);
    }

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send('Stock Card Item updated successfully');
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'UPDATE Stock Card Items';
    next(err);
  }
}

/**
 * Deletes a stock card item
 *
 * @param {Object} req - Express request object with item details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Empty JSON response on success
 */
async function deleteLaboratorySingleStockCardItems(req, res, next) {
  const { itemId, stockCardReleasedId, isOffice } = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    if (isOffice) {
      // Delete from office stock card table
      await pool.query(`DELETE FROM stockcard_office WHERE id = $1`, [itemId]);
    } else {
      // For laboratory items, also delete related released record if exists
      if (Number(stockCardReleasedId) !== 0) {
        await pool.query(
          `DELETE FROM stockcard_laboratory_released WHERE id = $1`,
          [stockCardReleasedId]
        );
      }
      // Delete from laboratory stock card table
      await pool.query(`DELETE FROM stockcard_laboratory WHERE id = $1`, [
        itemId,
      ]);
    }

    // Commit transaction
    await pool.query('COMMIT');
    res.json();
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Deleting borrower slip items';
    next(err);
  }
}

exports.getPaginatedStockCardItems = getPaginatedStockCardItems;
exports.addStockCardItems = addStockCardItems;
exports.updateStockCardItems = updateStockCardItems;
exports.deleteLaboratorySingleStockCardItems =
  deleteLaboratorySingleStockCardItems;
