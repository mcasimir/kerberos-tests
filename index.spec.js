const execa = require('execa');
var hostile = require('hostile');
const util = require('util');

const setHostEntry = util.promisify(hostile.set.bind(hostile));
// const removeHostEntry = util.promisify(hostile.remove.bind(hostile));

describe('setup', () => {
  it('has docker', () => {
    execa('docker', ['--version'], {stdio: 'inherit'});
    execa('docker-compose', ['--version'], {stdio: 'inherit'});
  });

  it('can change hosts', async() => {
    await setHostEntry('127.0.0.1', 'bla.example.com');
  });
});


