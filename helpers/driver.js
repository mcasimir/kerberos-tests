const { MongoClient } = require('mongodb');

async function connectAndReturnUser(connectionString, driverOptions) {
  let client;
  try {
    client = await MongoClient.connect(
      connectionString,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ...driverOptions
      }
    );

    const connectionStatus = await client.db().command({connectionStatus : 1});

    const authenticatedUser =
      ((connectionStatus.authInfo || {}).authenticatedUsers || [])[0];

      return authenticatedUser;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

module.exports = {
  connectAndReturnUser
};