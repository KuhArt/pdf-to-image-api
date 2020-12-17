const { Poppler } = require('node-poppler');

const poppler = new Poppler('/usr/bin');
const options = {
  singleFile: true,
  jpegFile: true,
};

module.exports = async ({ outputPath, pdfPath }) => {
  return poppler.pdfToCairo(pdfPath, outputPath, options);
};
