const pool = require('../config/db.config.js');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

const isAllowedUsers = [
  'Admin',
  'Custodian',
  'STA',
  'Faculty',
  'Dean',
  'Program Head',
];

function verifyToken(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) return res.json();

  jwt.verify(token, jwtSecret, async (err, { id }) => {
    if (err) next(err);

    const userInfo = await pool.query(
      `
      SELECT 
        user_role, email, id, user_program, laboratory, full_name, photo_url, esign_url, is_active, department, office, branch
      FROM 
        users WHERE id = $1
      `,
      [id]
    );

    const user = userInfo.rows[0];

    if (!user.is_active) {
      console.log(`User ${user.email} is deactivated`);
      return res.status(401).send('This account is deactivated!');
    }

    if (!isAllowedUsers.includes(user.user_role)) {
      console.log(`User ${user.email} is not allowed to access this page`);
      return res.status(401).send('Unauthorized to process this request!');
    }

    req.user = user;
    next();
  });
}

exports.verifyToken = verifyToken;
