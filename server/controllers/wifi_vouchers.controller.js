const pool = require('../config/db.config');

// ==== GET SINGLE LABORATORY WIFI VOUCHERS ====
async function getSingleLabWifiVoucher(req, res, next) {
  const { laboratory } = req.query;

  try {
    const result = await pool.query(
      'SELECT voucher_code FROM wifi_voucher WHERE laboratory LIKE $1',
      [laboratory]
    );

    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching single laboratory wifi voucher';
    next(err);
  }
}
// ==== GET LABORATORY WIFI VOUCHERS ====
async function getLaboratoryWifiVouchers(req, res, next) {
  const { laboratory } = req.body;

  let query = 'SELECT * FROM wifi_voucher ';
  let values = [];

  if (laboratory.length > 0) {
    query += 'WHERE laboratory = ANY($1)';
    values.push(laboratory);
  }

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    err.title = 'Fetching laboratory wifi vouchers';
    next(err);
  }
}

// ==== GET ADD LABORATORY WIFI VOUCHERS ====
async function addLaboratoryWifiVoucher(req, res, next) {
  const { forAddingData } = req.body;
  const { email } = req.user;

  try {
    for (let i = 0; i < forAddingData.length; i++) {
      const { laboratory, voucher_code } = forAddingData[i];
      await pool.query(
        'UPDATE wifi_voucher SET voucher_code = $1, set_by = $2, created_at = NOW() WHERE laboratory = $3 RETURNING *',
        [voucher_code, email, laboratory]
      );
    }

    res.json();
  } catch (err) {
    err.title = 'Fetching utilization with schedule id';
    next(err);
  }
}

exports.getLaboratoryWifiVouchers = getLaboratoryWifiVouchers;
exports.addLaboratoryWifiVoucher = addLaboratoryWifiVoucher;
exports.getSingleLabWifiVoucher = getSingleLabWifiVoucher;
