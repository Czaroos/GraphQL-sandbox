const { createWriteStream, mkdirSync, readdirSync } = require('fs');
const path = require('path');
const uploadedDirPath = path.join(__dirname, '../uploaded');
const mime = require('mime');
const { setTransaction } = require('./dbqueries');
const fs = require('fs');

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const storeUpload = async ({ stream, filename, mimetype }) => {
  const path = `uploaded/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
};

const getFiles = async () => {
  const files = await readdirSync(uploadedDirPath);
  return files.map((file) => {
    return {
      filename: file,
      mimetype: mime.getType(file),
      path: `uploaded/${file}`,
    };
  });
};

const uploadFile = async (_, { file, isTesting = false }) => {
  const directoryExists = await fs.promises
    .access(uploadedDirPath)
    .then(() => true)
    .catch(() => false);
  if (!directoryExists) {
    mkdirSync(uploadedDirPath, { recursive: true });
  }
  const upload = await processUpload(file);
  const values = [upload.path];
  await setTransaction(
    'INSERT INTO "Image" ("url") VALUES ($1) RETURNING *',
    values,
    isTesting
  );
  return upload;
};

module.exports = { processUpload, getFiles, uploadFile };
