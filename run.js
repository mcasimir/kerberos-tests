const execa = require('execa');
const commandExists = require('command-exists');

const mochaArgs = [
  '--timeout', '600000',
  'index.spec.js'
];

try {
  if (commandExists.sync('sudo')) {
    execa.sync('sudo', [
      'mocha',
      ...mochaArgs
    ], {stdio: 'inherit'});
  } else {
    execa.sync('mocha', [
      ...mochaArgs
    ], {stdio: 'inherit'});
  }
} catch (e) {
  console.error(e.message);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}
