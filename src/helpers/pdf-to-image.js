const gs = require('gs');

module.exports = ({ outputPath, pdfPath }) => {
  return new Promise((resolve, reject) => {
    gs()
      .batch()
      .nopause()
      .q()
      .device('jpeg')
      .option('-dTextAlphaBits=4')
      .option('-dFirstPage=1')
      .option('-dLastPage=2')
      .res(300)
      .output(outputPath)
      .input(pdfPath)
      .exec((err, data) => {
        if (err) {
          console.log('Error running Ghostscrript', err);
          reject(err);
        } else {
          console.log('Ghostscrript completed successfully', data);
          resolve();
        }
      });
  });
};
