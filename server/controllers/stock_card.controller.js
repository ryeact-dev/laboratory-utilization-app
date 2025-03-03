const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { dateConverter } = require('../util/dateConverter');
const { getListOfLaboratory } = require('../util/laboratoryList');

/**
 * Retrieves paginated office stock cards with filtering options
 *
 * @param {Object} req - Express request object with filter parameters in body and query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with stock cards, count, and pagination info
 */
async function getPaginatedOfficeStockCards(req, res, next) {
  const { user_role: userRole, laboratory: userLaboratory } = req.user;
  const { laboratory, category, limit, page, mismSubmissionDate } = req.body;
  const { search } = req.query;

  // Only sum up the items received and released for 5 years
  // const less5YearsDate = new Date();
  // less5YearsDate.setFullYear(less5YearsDate.getFullYear() - 5);

  try {
    // Get active school year dates for filtering
    const activeSchoolYearResult = await pool.query(
      'SELECT ending_date, starting_date FROM schoolyear WHERE sy_is_active = $1',
      [true]
    );

    if (activeSchoolYearResult.rows.length === 0) {
      return res
        .status(404)
        .send('No active school year found. Please set one!');
    }

    const endingDate = new Date(activeSchoolYearResult.rows[0].ending_date);
    const startingDate = new Date(activeSchoolYearResult.rows[0].starting_date);

    // Base query for stock cards with balance calculation
    let stockCardQuery = `
      SELECT
        s.id, s.laboratory_name, s.item_name, s.item_unit, s.item_category, s.created_at, s.created_by,
        u.full_name AS created_by,
        SUM(COALESCE(so.item_received, 0)) - SUM(COALESCE(so.item_released, 0)) AS remaining_balance,
        sr.remarks AS remarks
      FROM
        stockcard AS s
      LEFT JOIN
        stockcard_office AS so ON s.id = so.stockcard_id
      LEFT JOIN
        users AS u ON s.created_by = u.id
      LEFT JOIN
        stockcard_remarks AS sr ON s.id = sr.stockcard_id AND DATE_TRUNC('month', sr.as_of_month_of::date) = DATE_TRUNC('month', $4::date)
      WHERE
        ($1::text[] IS NULL OR s.laboratory_name = ANY($1::text[])) 
      AND 
        s.item_category = $2 
      AND 
        s.item_name ILIKE $3
      `;

    // Determine laboratory filter based on user role and selection
    let selectedLaboratories = [];
    if (laboratory === 'All Offices') {
      if (userRole !== 'Admin' && userRole !== 'Dean') {
        // Regular users can only see their assigned laboratories
        selectedLaboratories = Array.isArray(userLaboratory)
          ? userLaboratory
          : [userLaboratory];
      } else {
        // Admin and Dean can see all laboratories
        selectedLaboratories = null;
      }
    } else {
      // Specific laboratory selected
      selectedLaboratories = [laboratory];
    }

    let queryParams = [selectedLaboratories, category, `%${search}%`];

    // Add date filter if mismSubmissionDate is provided
    if (mismSubmissionDate) {
      stockCardQuery += ` OR (so.date_received <= $4 AND so.date_released <= $4) `;
      queryParams.push(new Date(mismSubmissionDate));
    }

    // Add pagination parameters
    queryParams.push(Number(limit), Number(page) * Number(limit));
    stockCardQuery += ` GROUP BY s.id, u.full_name, sr.remarks
                        ORDER by s.item_name 
                        LIMIT $${queryParams.length - 1}
                        OFFSET $${queryParams.length}
                      `;

    // Execute main stock cards query
    const officeStockCardsQuery = pool.query(stockCardQuery, queryParams);

    // Count total stock cards for pagination
    const countCardsQuery = pool.query(
      ` SELECT 
          COUNT(*)
        FROM
          stockcard
        WHERE
         ($1::text[] IS NULL OR laboratory_name = ANY($1::text[])) 
        AND
          item_category = $2
        AND
          item_name ILIKE $3
      `,
      [selectedLaboratories, category, `%${search}%`]
    );

    // Query to get received items within school year
    let itemReceivedQuery = `
      SELECT
        s.id,
        SUM(COALESCE(so.item_received, 0)) AS counted_item_received,
        MAX(so.date_received) AS latest_date_received
      FROM
        stockcard AS s
      LEFT JOIN
        stockcard_office AS so ON s.id = so.stockcard_id
      WHERE
        ($1::text[] IS NULL OR s.laboratory_name = ANY($1::text[])) 
        AND s.item_category = $2
        AND so.date_received >= $3 AND so.date_received <= $4
      GROUP BY
        s.id
      ORDER BY
        s.item_name
    `;

    let itemReceivedParams = [
      selectedLaboratories,
      category,
      startingDate,
      new Date(mismSubmissionDate),
    ];

    // Execute query for approved stocks
    const officeApprovedStocksQuery = pool.query(
      itemReceivedQuery,
      itemReceivedParams
    );

    // Execute all queries concurrently for better performance
    const [
      officeStockCardsResult,
      officeApprovedStocksResult,
      countedCardsResult,
    ] = await Promise.all([
      officeStockCardsQuery,
      officeApprovedStocksQuery,
      countCardsQuery,
    ]);

    // Combine results and calculate approved budget
    const stockCardsWithBudget = officeStockCardsResult.rows.map(
      (stockCard) => {
        // Find matching approved budget for this stock card within school year
        const itemReceived = officeApprovedStocksResult.rows.find(
          (stock) =>
            stock.id === stockCard.id &&
            new Date(stock.latest_date_received) >= startingDate &&
            new Date(stock.latest_date_received) <= endingDate
        );

        return {
          ...stockCard,
          approved_budget: itemReceived?.counted_item_received || 0,
        };
      }
    );

    // Check if there are more results for pagination
    const hasMoreResults = stockCardsWithBudget.length === Number(limit);

    res.json({
      stockCards: stockCardsWithBudget,
      countedCards: countedCardsResult.rows[0].count,
      hasMore: hasMoreResults,
    });

    // console.log(result);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching laboratory stock cards';
    next(err);
  }
}

/**
 * Retrieves paginated laboratory stock cards with filtering options
 *
 * @param {Object} req - Express request object with filter parameters in body and query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with stock cards, count, and pagination info
 */
async function getPaginatedLaboratoryStockCards(req, res, next) {
  const { user_role: userRole, laboratory: userLaboratory } = req.user;
  const { laboratory, category, limit, page, mismSubmissionDate } = req.body;
  const { search } = req.query;

  // Determine which stockcard table to use based on category
  const stockType = category === '' ? 'laboratory' : 'laboratory_released';

  // Only sum up the items received and released for 5 years
  // const less5YearsDate = new Date();
  // less5YearsDate.setFullYear(less5YearsDate.getFullYear() - 5);

  try {
    // Get active school year dates for filtering
    const activeSchoolYearResult = await pool.query(
      'SELECT ending_date, starting_date FROM schoolyear WHERE sy_is_active = $1',
      [true]
    );

    if (activeSchoolYearResult.rows.length === 0) {
      return res
        .status(404)
        .send('No active school year found. Please set one!');
    }

    const endingDate = new Date(activeSchoolYearResult.rows[0].ending_date);
    const startingDate = new Date(activeSchoolYearResult.rows[0].starting_date);

    // Base query for stock cards with balance calculation
    let stockCardQuery = `
      SELECT
        s.id, s.laboratory_name, s.item_name, s.item_unit, s.item_category, s.created_at, s.created_by,
        u.full_name AS created_by,
        SUM(COALESCE(so.item_received, 0)) - SUM(COALESCE(so.item_released, 0)) AS remaining_balance,
        sr.remarks AS remarks
      FROM
        stockcard AS s
      INNER JOIN
        stockcard_${stockType} AS so ON s.id = so.stockcard_id
      INNER JOIN
        users AS u ON s.created_by = u.id
      LEFT JOIN
        stockcard_remarks AS sr ON s.id = sr.stockcard_id AND DATE_TRUNC('month', sr.as_of_month_of::date) = DATE_TRUNC('month', $4::date)
      WHERE
        ($1::text[] IS NULL OR s.laboratory_name = ANY($1::text[])) AND s.item_name ILIKE $2
    `;

    // Query to count total stock cards for pagination
    let countCardsQuery = `
      SELECT 
        COUNT(*)
      FROM
        stockcard
      WHERE 
         ($1::text[] IS NULL OR laboratory_name = ANY($1::text[])) AND item_name ILIKE $2
    `;

    // Determine laboratory filter based on user role and selection
    let selectedLaboratories = [];
    if (laboratory === 'All Laboratories') {
      if (userRole !== 'Admin' && userRole !== 'Dean') {
        // Regular users can only see their assigned laboratories
        selectedLaboratories = Array.isArray(userLaboratory)
          ? userLaboratory
          : [userLaboratory];
      } else {
        // Admin and Dean can see all laboratories
        selectedLaboratories = null;
      }
    } else {
      // Specific laboratory selected
      selectedLaboratories = [laboratory];
    }

    const searchTerm = search ? `%${search}%` : '%';
    let queryParams = [selectedLaboratories, searchTerm];

    // Add category filter
    if (category !== '') {
      // Filter by specific category
      stockCardQuery += ` AND s.item_category = $3 `;
      countCardsQuery += ` AND item_category = $3 `;
      queryParams.push(category);
    } else {
      // Filter by both Consumable and Reusable categories
      stockCardQuery += ` AND s.item_category = ANY($3) `;
      countCardsQuery += ` AND item_category = ANY($3) `;
      queryParams.push(['Consumable', 'Reusable']);
    }

    // Add date filter if mismSubmissionDate is provided
    if (mismSubmissionDate) {
      stockCardQuery += ` OR so.date_received <= $4 AND so.date_released <= $4 `;
      queryParams.push(new Date(mismSubmissionDate));
    }

    // Add pagination parameters
    queryParams.push(Number(limit), Number(page) * Number(limit));
    stockCardQuery += ` GROUP BY s.id, u.full_name, sr.remarks 
                        ORDER by s.item_name 
                        LIMIT $${queryParams.length - 1}
                        OFFSET $${queryParams.length}
                      `;

    // Execute main stock cards query
    const laboratoryStockCardsQuery = pool.query(stockCardQuery, queryParams);

    // Execute count query for pagination
    const laboratoryCountStockCardsQuery = pool.query(
      countCardsQuery,
      queryParams.slice(0, 3)
    );

    // Query to get received items within school year
    let itemReceivedQuery = `
        SELECT
          s.id,
          SUM(COALESCE(so.item_received, 0)) AS counted_item_received,
          MAX(so.date_received) AS latest_date_received
        FROM
          stockcard AS s
        LEFT JOIN
          stockcard_${stockType} AS so ON s.id = so.stockcard_id
        WHERE
          ($1::text[] IS NULL OR s.laboratory_name = ANY($1::text[])) AND so.date_received >= $2 AND so.date_received <= $3 
    `;

    let itemReceivedParams = [
      selectedLaboratories,
      startingDate,
      new Date(mismSubmissionDate),
    ];

    // Add category filter to received items query
    if (category !== '') {
      itemReceivedQuery += ` AND s.item_category = $4 `;
      itemReceivedParams.push(category);
    } else {
      itemReceivedQuery += ` AND s.item_category = ANY($4) `;
      itemReceivedParams.push(['Consumable', 'Reusable']);
    }

    itemReceivedQuery += ` GROUP BY s.id, so.date_received
                           ORDER BY s.item_name `;

    // Execute query for approved stocks
    const laboratoryApprovedStocksQuery = pool.query(
      itemReceivedQuery,
      itemReceivedParams
    );

    // Execute all queries concurrently for better performance
    const [
      laboratoryStockCardsResult,
      laboratoryApprovedStocksResult,
      countedCardsResult,
    ] = await Promise.all([
      laboratoryStockCardsQuery,
      laboratoryApprovedStocksQuery,
      laboratoryCountStockCardsQuery,
    ]);

    // Combine results and calculate approved budget
    const stockCardsWithBudget = laboratoryStockCardsResult.rows.map(
      (stockCard) => {
        // Find matching approved budget for this stock card within school year
        const itemReceived = laboratoryApprovedStocksResult.rows.find(
          (stock) =>
            stock.id === stockCard.id &&
            new Date(stock.latest_date_received) >= startingDate &&
            new Date(stock.latest_date_received) <= endingDate
        );

        return {
          ...stockCard,
          approved_budget: itemReceived?.counted_item_received || 0,
        };
      }
    );

    // Check if there are more results for pagination
    const hasMoreResults = stockCardsWithBudget.length === Number(limit);

    res.json({
      stockCards: stockCardsWithBudget,
      countedCards: countedCardsResult.rows[0].count,
      hasMore: hasMoreResults,
    });
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching laboratory stock cards';
    next(err);
  }
}

/**
 * Retrieves laboratory stock cards that have been released
 *
 * @param {Object} req - Express request object with laboratory in query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with released stock cards
 */
async function getReleasedLaboratoryStockCards(req, res, next) {
  const { laboratory } = req.query;

  // Get list of laboratories based on the selected laboratory
  const laboratoryList = getListOfLaboratory(laboratory);

  try {
    // Query to get stock cards with remaining balance calculation
    let stockCardQuery = `
      SELECT
        s.id, s.item_name, s.item_unit, s.item_category,
        SUM(COALESCE(so.item_received, 0)) - SUM(COALESCE(so.item_released, 0)) AS remaining_balance
      FROM
        stockcard AS s
      LEFT JOIN
        stockcard_laboratory_released AS so ON s.id = so.stockcard_id
      WHERE
        s.laboratory_name = ANY($1) AND s.item_category = ANY($2)
      GROUP BY 
        s.id, s.item_name, s.item_unit, s.item_category
      ORDER by 
        s.item_name   
    `;

    let queryParams = [laboratoryList, ['Consumable', 'Reusable']];

    // Execute stock cards query
    const laboratoryStockCardsQuery = pool.query(stockCardQuery, queryParams);

    // Query to get borrowed items that affect remaining balance
    const borrowedItemsQuery = pool.query(
      `SELECT stockcard_item_id, remaining_balance FROM borrower_slip_lab_temporary_records WHERE laboratory_name = ANY($1)`,
      [laboratoryList]
    );

    // Execute both queries concurrently
    const [laboratoryStockCardsResult, borrowedItemsResult] = await Promise.all(
      [laboratoryStockCardsQuery, borrowedItemsQuery]
    );

    let materialsList = laboratoryStockCardsResult.rows;

    // Debug filter for specific item
    materialsList.filter(
      (item) => item.id === 'e914bfa7-5403-42bd-924f-4fcd6d639c50'
    );

    // Adjust remaining balance based on borrowed items
    if (borrowedItemsResult.rows.length > 0) {
      materialsList = laboratoryStockCardsResult.rows.map((stockCard) => {
        // Find matching borrowed item record
        const borrowedItem = borrowedItemsResult.rows.find(
          (borrowedItem) => borrowedItem.stockcard_item_id === stockCard.id
        );

        // Update remaining balance if borrowed item found
        if (borrowedItem) {
          return {
            ...stockCard,
            remaining_balance: borrowedItem.remaining_balance,
          };
        } else return { ...stockCard };
      });
    }

    res.json(materialsList);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'Fetching laboratory released stock cards';
    next(err);
  }
}

/**
 * Creates a new stock card
 *
 * @param {Object} req - Express request object with stock card details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function createStockCard(req, res, next) {
  const { id: userId } = req.user;
  const { item_name, laboratory_name } = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Generate unique ID for new stock card
    const stockCardId = uuidv4();

    // Extract fields that need special handling
    const { remarks, submissionDate, ...stockCardData } = req.body;

    // Check if stock card with same name already exists in the laboratory
    const existingStockCardResult = await pool.query(
      `SELECT * FROM stockcard WHERE item_name ILIKE $1 AND laboratory_name = $2`,
      [item_name, laboratory_name]
    );

    if (existingStockCardResult.rows.length > 0) {
      return res.status(400).send('Stock card already exists');
    }

    // Prepare columns and values for insertion
    const columns = Object.keys(stockCardData);
    let values = Object.values(stockCardData);

    // Add ID and creator
    columns.push('id', 'created_by');
    values.push(stockCardId, userId);

    const columnNames = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    // Insert stock card
    await pool.query(
      `INSERT INTO stockcard (${columnNames}) VALUES (${placeholders})`,
      values
    );

    // Insert stock card remarks
    await pool.query(
      `INSERT INTO stockcard_remarks (stockcard_id, remarks, as_of_month_of, created_by) VALUES ($1, $2, $3, $4)`,
      [stockCardId, remarks, new Date(submissionDate), userId]
    );

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send('Stock card created successfully');
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    err.title = 'Creating stock card';
    next(err);
  }
}

/**
 * Updates an existing stock card
 *
 * @param {Object} req - Express request object with updated details in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function updateStockCard(req, res, next) {
  const { id: userId } = req.user;
  const {
    id,
    item_name,
    item_unit,
    item_category,
    laboratory_name,
    remarks,
    submissionDate,
  } = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Check if another stock card with same name already exists
    const existingStockCardResult = await pool.query(
      `SELECT * FROM stockcard WHERE item_name ILIKE $1 AND id <> $2 AND laboratory_name = $3`,
      [item_name, id, laboratory_name]
    );

    if (existingStockCardResult.rows.length > 0) {
      return res.status(400).send('Stock card already exists');
    }

    // Define columns and values for update
    const columns = [
      'item_name',
      'item_unit',
      'item_category',
      'remarks',
      'laboratory_name',
    ];

    const values = [
      item_name.toLowerCase(),
      item_unit.toLowerCase(),
      item_category,
      remarks,
      laboratory_name,
    ];

    values.push(id);

    // Prepare SET clause for UPDATE query
    const setValues = columns
      .map((column, i) => `${column} = $${i + 1}`)
      .join(', ');

    const updateQuery = `UPDATE stockcard SET ${setValues} WHERE id = $6`;

    // Check if remarks for this month already exist
    const existingRemarksResult = await pool.query(
      `SELECT COUNT(*) FROM stockcard_remarks WHERE stockcard_id = $1 AND DATE_TRUNC('month', as_of_month_of::date) = DATE_TRUNC('month', $2::date)`,
      [id, new Date(submissionDate)]
    );

    // Update or insert remarks based on existence
    if (existingRemarksResult.rows[0].count > 0) {
      // Update existing remarks
      await pool.query(
        `UPDATE stockcard_remarks SET remarks = $3 WHERE stockcard_id = $1 AND as_of_month_of = $2`,
        [id, new Date(submissionDate), remarks]
      );
    } else {
      // Insert new remarks
      await pool.query(
        `INSERT INTO stockcard_remarks (stockcard_id, remarks, as_of_month_of, created_by) VALUES ($1, $2, $3, $4)`,
        [id, remarks, new Date(submissionDate), userId]
      );
    }

    // Update stock card
    await pool.query(updateQuery, values);

    // Commit transaction
    await pool.query('COMMIT');

    res.status(200).send(`${item_name} updated successfully`);
  } catch (err) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');

    err.title = 'UPDATING Stock Card';
    next(err);
  }
}

/**
 * Deletes a stock card
 *
 * @param {Object} req - Express request object with stock card ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} Success message or error
 */
async function deleteStockCard(req, res, next) {
  const { full_name } = req.user;
  const { id } = req.params;

  try {
    // Delete stock card and return deleted data
    const { rows: deletedStockCard } = await pool.query(
      `DELETE FROM stockcard WHERE id = $1 RETURNING *`,
      [id]
    );

    // Log deletion for audit purposes
    console.log(
      `${full_name} deleted stock card ${
        deletedStockCard[0].item_name
      } :: ${dateConverter()}`
    );

    res
      .status(200)
      .send(`${deletedStockCard[0].item_name} deleted successfully`);
  } catch (err) {
    // Add context to the error for better debugging
    err.title = 'DELETING Stock Card';
    next(err);
  }
}

exports.getPaginatedOfficeStockCards = getPaginatedOfficeStockCards;
exports.getPaginatedLaboratoryStockCards = getPaginatedLaboratoryStockCards;
exports.getReleasedLaboratoryStockCards = getReleasedLaboratoryStockCards;
exports.createStockCard = createStockCard;
exports.updateStockCard = updateStockCard;
exports.deleteStockCard = deleteStockCard;
