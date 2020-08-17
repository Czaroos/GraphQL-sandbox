const { createWriteStream, mkdirSync, readdirSync } = require('fs');
const path = require('path');
const uploadedDirPath = path.join(__dirname, 'uploaded');
const mime = require('mime');
const { setTransaction } = require('./queries');
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

const uploadFile = async (_, { file, postId, isTesting = false }) => {
  const directoryExists = await fs.promises
    .access('uploaded')
    .then(() => true)
    .catch(() => false);
  if (!directoryExists) {
    mkdirSync('uploaded', { recursive: true });
  }
  const upload = await processUpload(file);
  const values = [postId, upload.path];
  await setTransaction(
    'INSERT INTO "Image" ("PostId", "url") VALUES ($1,$2) RETURNING *',
    values,
    isTesting
  );
  return { ...upload, postId };
};

module.exports = { processUpload, getFiles, uploadFile };
