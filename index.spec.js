const execa = require('execa');

var hostile = require('hostile');
const util = require('util');
const assert = require('assert');

const setHostEntry = util.promisify(hostile.set.bind(hostile));
const dns = require('dns').promises;

describe('setup', () => {
  it('has docker', () => {
    execa('docker', ['--version'], {stdio: 'inherit'});
    execa('docker-compose', ['--version'], {stdio: 'inherit'});
  });

  it('can change hosts', async() => {
    await setHostEntry('127.0.0.1', 'mongodb-enterprise.example.com');
    const ip = await dns.lookup('mongodb-enterprise.example.com');
    assert.strictEqual(ip.address, '127.0.0.1');
  });
});


