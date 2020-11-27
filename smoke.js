const { Octokit } = require('@octokit/core');

async function dispatch() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const json = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: 'mcasimir',
    repo: 'kerberos-tests',
    event_type: 'builds',
    client_payload: {
      urls: {
        linux_tgz: 'https://downloads.mongodb.com/compass/mongosh-0.5.2-linux.tgz',
        linux_deb: 'https://downloads.mongodb.com/compass/mongosh_0.5.2_amd64.deb',
        linux_rpm: 'https://downloads.mongodb.com/compass/mongosh-0.5.2-x86_64.rpm',
        mac_zip: 'https://downloads.mongodb.com/compass/mongosh-0.5.2-darwin.zip',
        win_zip: 'https://downloads.mongodb.com/compass/mongosh-0.5.2-win32.zip'
      }
    }
  });

  console.log(json);
}

(async() => {
  await dispatch();
})().catch((e) => {
  console.log(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

