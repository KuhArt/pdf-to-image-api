const axios = require('axios');
const fs = require('fs');
const { promisify } = require('util');

const unlink = promisify(fs.unlink);

const downloadPdf = async ({ dest, url }) => {
  const fileStream = fs.createWriteStream(dest);
  const pdfResponse = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  });

  return new Promise((resolve) => {
    pdfResponse.data.pipe(fileStream).on('finish', resolve);
  });
};

const removeFile = async (path) => {
  try {
    await unlink(path);
  } catch (err) {
    console.log('Remove file error', err);
  }
};

module.exports = {
  downloadPdf,
  removeFile,
};
