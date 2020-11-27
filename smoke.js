const { Octokit } = require('@octokit/core');

async function dispatch() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const json = await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
    owner: 'mcasimir',
    repo: 'kerberos-tests',
    event_type: 'builds'
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

