const assert = require('assert');
const { setHostEntry, removeHostEntry } = require('./helpers/hosts');
const { kinit, kdestroy } = require('./helpers/kerberos');
const driver = require('./helpers/driver');
const shell = require('./helpers/shell');

const PRINCIPAL_1 = 'mongodb.user@EXAMPLE.COM';
const SERVER_1_HOST = 'mongodb-krb-tests-1.example.com';
const SERVER_1 = `${SERVER_1_HOST}:29017`;
const SERVER_2_HOST = 'mongodb-krb-tests-2.example.com';
const SERVER_2 = `${SERVER_2_HOST}:29018`;

function gssapiUri(user, hosts, searchParams) {
  const qs = new URLSearchParams({
    authMechanism: 'GSSAPI',
    authSource: '$external',
    ...searchParams
  }).toString()
  return `mongodb://${encodeURIComponent(user)}@${hosts}/test?${qs}`;
}

describe('kerberos', () => {
  before(async() => {
    await setHostEntry('127.0.0.1', 'mongodb-krb-tests-1.example.com');
    await setHostEntry('127.0.0.1', 'mongodb-krb-tests-2.example.com');
  });

  beforeEach(async() => {
    await kdestroy();
    await kinit('mongodb.user@EXAMPLE.COM', 'password');
  });

  after(async() => {
    await removeHostEntry('127.0.0.1', 'mongodb-krb-tests-1.example.com');
    await removeHostEntry('127.0.0.1', 'mongodb-krb-tests-2.example.com');
    await kdestroy();
  });

  [
    ['driver', driver],
    ['shell', shell]
  ].forEach(([type, target]) => {
    const only = (t) => {
      if (type === t) {
        return { it: it };
      }

      const skippedIt = (...args) => { return it.skip(...args); }
      skippedIt.only = () => {};
      skippedIt.skip = () => {};

      return { it: skippedIt };
    }

    describe(type, () => {
      it('connects with a complete connection string to mongodb/ service principal', async() => {
        const user = await target.connectAndReturnUser(
          gssapiUri(PRINCIPAL_1, SERVER_1, { gssapiServiceName: 'mongodb' })
        );

        assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
      });

      it('Can omit gssapiServiceName', async() => {
        const user = await target.connectAndReturnUser(
          gssapiUri(PRINCIPAL_1, SERVER_1)
        );

        assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
      });

      it('connects with alternate service name (?gssapiServiceName=alternate)', async() => {
        const user = await target.connectAndReturnUser(
          gssapiUri(PRINCIPAL_1, SERVER_2, { gssapiServiceName: 'alternate' })
        );

        assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
      });

      it('connects with alternate service name (?authMechanismProperties=SERVICE_NAME:alternate)', async() => {
        const user = await target.connectAndReturnUser(
          gssapiUri(
            PRINCIPAL_1, SERVER_2,
            { authMechanismProperties: 'SERVICE_NAME:alternate' }
          )
        );

        assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
      });

      only('driver')
        .it('connects with alternate service name (?authMechanismProperties=gssapiServiceName:alternate)', async() => {

          // NOTE: this is not aligned with the spec
          const user = await target.connectAndReturnUser(
            gssapiUri(PRINCIPAL_1, SERVER_2, {
              authMechanismProperties: 'gssapiServiceName:alternate'
            })
          );

          assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
        });

      only()

      only('shell')
        .it('connects with alternate service name (--gssapiServiceName)', async() => {
          const user = await target.connectAndReturnUser(
            gssapiUri(PRINCIPAL_1, SERVER_2),
            '--gssapiServiceName=alternate'
          );

          assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
        });

      only('shell')
        .it('connects with alternate service name (--authMechanismProperties=SERVICE_NAME:alternate)', async() => {
          const user = await target.connectAndReturnUser(
            gssapiUri(PRINCIPAL_1, SERVER_2),
            '--gssapiServiceName=alternate'
          );

          assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
        });

      only('shell')
        .it.only('connects with gssapiHostName', async() => {
          const user = await target.connectAndReturnUser(
            gssapiUri(PRINCIPAL_1, '0.0.0.0'),
            `--gssapiHostName=${SERVER_2_HOST}`
          );

          assert.deepStrictEqual(user, { user: PRINCIPAL_1, db: '$external' });
        });
    });
  });
});
