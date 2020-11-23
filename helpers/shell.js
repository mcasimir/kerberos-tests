const execa = require('execa');

async function connectAndReturnUser(...args) {
  const { stdout } = await execa(
    'mongo',
    [ ...args,
      '--quiet',
      '--eval',
      'printjson(db.runCommand({connectionStatus: 1}))'
    ]
  );

  const connectionStatus = JSON.parse(stdout);
  const authenticatedUser =
    ((connectionStatus.authInfo || {}).authenticatedUsers || [])[0];

  return authenticatedUser;
}

module.exports = {
  connectAndReturnUser
};