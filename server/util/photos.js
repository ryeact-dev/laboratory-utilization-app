const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db.config');

async function uploadedPhoto(file, photoUrl, desc, isESig) {
  // delete the current photo if the user uploaded a new photo file
  if (photoUrl) await deleteUserPhoto(photoUrl);

  if (!file) return null;

  const { dir, name, ext } = path.parse(file.path);
  const { path: filePath } = file;

  let newPath;
  if (isESig) {
    newPath = path.join(
      dir.replace('uploads\\img\\dummy', 'uploads\\img\\esign'),
      `${desc}${ext}.webp`
    );
  } else {
    newPath = path.join(
      dir.replace('uploads\\img\\dummy', 'uploads\\img\\profile_pic'),
      `${desc}${ext}.webp`
    );
  }

  // Use sharp to resize and compress the image
  await sharp(filePath)
    .resize({ width: 800 })
    .webp({ quality: 50 })
    .toFile(newPath);

  // Check if the file exists before attempting to delete it
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}: ${err}`);
    }
  }

  // Store the new file path to the database
  let pathName = newPath.replace('uploads/img/profile_pic', '');
  if (isESig) {
    pathName = newPath.replace('uploads/img/esign', '');
  }

  return pathName;
}

async function deleteUserPhoto(photoUrl) {
  fs.unlink(path.join(__dirname, '../', photoUrl), (err) => {
    if (err) {
      console.error(`Failed to delete image at ${photoUrl}: ${err.stack}`);
    }
  });
}

async function uploadedPhotoII(file, photoUrl, desc, isESig) {
  // delete the current photo if the user uploaded a new photo file
  if (photoUrl) await deleteUserPhoto(photoUrl);

  if (!file) return null;

  const { dir, name, ext } = path.parse(file.path);
  const { path: filePath } = file;

  let newPath;
  if (isESig) {
    newPath = path.join(
      dir.replace(
        `uploads${path.sep}img${path.sep}dummy`,
        `.${path.sep}public${path.sep}images${path.sep}esign`
      ),
      `${desc}${ext}.webp`
    );
  } else {
    newPath = path.join(
      dir.replace(
        `uploads${path.sep}img${path.sep}dummy`,
        `.${path.sep}public${path.sep}images${path.sep}photo`
      ),
      `${desc}${ext}.webp`
    );
  }

  // Use sharp to resize and compress the image
  await sharp(filePath)
    .resize({ width: 800 })
    .webp({ quality: 50 })
    .toFile(newPath);

  // Check if the file exists before attempting to delete it
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filePath}: ${err}`);
    }
  }

  // Store the new file path to the database
  let pathName = newPath.replace(
    `.${path.sep}public${path.sep}images${path.sep}photo`,
    ''
  );
  if (isESig) {
    pathName = newPath.replace(
      `.${path.sep}public${path.sep}images${path.sep}esign`,
      ''
    );
  }

  return pathName;
}

exports.uploadedPhoto = uploadedPhoto;
exports.deleteUserPhoto = deleteUserPhoto;
