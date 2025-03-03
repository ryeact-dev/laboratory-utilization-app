const pool = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');
const { verifyLaboratories } = require('../util/verifyLaboratories');

// ==== GET LABORATORY SOFTWARE LIST ====
async function getLaboratorySoftware(req, res, next) {
  const { schoolyear, laboratory } = req.query;

  const response = verifyLaboratories(req.user, laboratory);
  if (response.isError) return res.status(401).send('Unauthorized Request.');

  try {
    const listOfSoftwares = await pool.query(
      'SELECT * FROM software WHERE school_year = $1 AND laboratory = $2 ORDER BY subs_expiration',
      [schoolyear, laboratory]
    );
    res.json(listOfSoftwares.rows);
  } catch (err) {
    err.title = 'Fetching software list';
    next(err);
  }
}

// ==== ADD A SOFTWARE ON THE LIST ====
async function addLaboratorySoftware(req, res, next) {
  const { school_year, title, subs_expiration, laboratory } = req.body;

  try {
    const id = uuidv4();
    const createdAt = new Date();
    await pool.query(
      'INSERT INTO software (id, title, subs_expiration, laboratory, school_year, created_at) VALUES ( $1, $2, $3, $4, $5, $6 )',
      [id, title, subs_expiration, laboratory, school_year, createdAt]
    );
    res.json();
  } catch (err) {
    err.title = 'Adding software in the list';
    next(err);
  }
}

// ==== UPDATE A SOFTWARE ON THE LIST ====
async function updateLaboratorySoftware(req, res, next) {
  const { softwareId, school_year, title, subs_expiration, laboratory } =
    req.body;

  try {
    await pool.query(
      'UPDATE software SET title = $1, subs_expiration = $2, laboratory = $3, school_year = $4 WHERE id = $5',
      [title, subs_expiration, laboratory, school_year, softwareId]
    );
    res.json();
  } catch (err) {
    err.title = 'Updating software in the list';
    next(err);
  }
}

// ==== DELETE A SOFTWARE ON THE LIST  ====
async function deleteLaboratorySoftware(req, res, next) {
  const { softwareId } = req.params;

  try {
    await pool.query(`DELETE FROM software WHERE id = $1`, [softwareId]);
    res.json();
  } catch (err) {
    if (err.constraint) {
      return res
        .status(403)
        .send('Please remove first the software on the hardware list');
    }
    err.title = 'Deleting software in the list';
    next(err);
  }
}

exports.getLaboratorySoftware = getLaboratorySoftware;
exports.addLaboratorySoftware = addLaboratorySoftware;
exports.updateLaboratorySoftware = updateLaboratorySoftware;
exports.deleteLaboratorySoftware = deleteLaboratorySoftware;
