const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs');
const os = require('os');
const { PerformanceObserver, performance } = require('perf_hooks');
const logger = require('koa-logger');
const pdfToImg = require('../helpers/pdf-to-image');
const { downloadPdf, removeFile } = require('../helpers/fs');

const app = new Koa();
const router = new Router();
const auth = require('./middlewares/auth');

const perfMarks = [
  'pdfToImg.downloadPdf',
  'pdfToImg.convertToImg',
  'pdfToImg.resizeImg',
];

const getStartMark = (mark) => `${mark}.start`;
const getEndMark = (mark) => `${mark}.end`;

const profileCall = async ({ func, markIndex }) => {
  performance.mark(getStartMark(perfMarks[markIndex]));
  await func();
  performance.mark(getEndMark(perfMarks[markIndex]));
  performance.measure(
    perfMarks[markIndex],
    getStartMark(perfMarks[markIndex]),
    getEndMark(perfMarks[markIndex]),
  );
};

router.get('/', async (ctx) => {
  const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
      console.log(`${entry.name} ->  ${entry.duration}`);
    });
    performance.clearMarks();
  });
  perfObserver.observe({ entryTypes: ['measure'], buffer: true });

  const { url = '' } = ctx.request.query;

  if (!url) {
    ctx.status = 204;
    ctx.body = {};
    return;
  }

  const tmpdir = os.tmpdir();
  const dest = `${tmpdir}/${Date.now()}-temp-pdf.pdf`;
  const imgName = `${Date.now()}-temp`;
  const destImg = `${tmpdir}/${imgName}`;
  const destImgWithFormat = `${tmpdir}/${imgName}.jpg`;

  try {
    await profileCall({
      func: () => downloadPdf({ dest, url }),
      markIndex: 0,
    });

    await profileCall({
      func: () => pdfToImg({ pdfPath: dest, outputPath: destImg }),
      markIndex: 1,
    });

    const readStream = fs.createReadStream(destImgWithFormat);

    ctx.response.attachment('image.jpg');
    ctx.body = readStream;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: `Error ${JSON.stringify(error)}!` };
  } finally {
    perfObserver.disconnect();
    removeFile(dest);
    removeFile(destImgWithFormat);
  }
});

app
  .use(logger())
  .use(auth())
  .use(router.routes());

const PORT = 80;

app.listen(80, () => {
  console.log(`Api server listening on ${PORT}`);
});
