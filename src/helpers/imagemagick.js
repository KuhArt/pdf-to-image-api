const { spawn } = require('child-process-promise');

const resize = async ({ imgDir, imgName }) => {
  const mogrifySettings = [
    '-format', 'jpg',
    '-resize', '1275x1650',
    imgName,
  ];

  const spawnEnvSettings = {
    capture: ['stdout', 'stderr'],
    cwd: imgDir,
  };

  const mogrifyProcess = await spawn('mogrify', mogrifySettings, spawnEnvSettings);

  mogrifyProcess.childProcess.kill();
};

module.exports = {
  resize,
};
