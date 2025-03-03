const pool = require('../config/db.config.js');

async function dbActiveSchoolYear(req, res, next) {
  const schoolYearResult = await pool.query(
    'SELECT * FROM schoolyear WHERE sy_is_active = $1',
    [true]
  );
  return schoolYearResult.rows[0];
}

exports.dbActiveSchoolYear = dbActiveSchoolYear;
