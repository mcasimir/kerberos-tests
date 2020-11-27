const fetch = require('node-fetch');

(async() => {
  const json = await fetch('https://api.github.com/repos/mcasimir/kerberos-tests/dispatches', {
    method: 'POST',
    body:    JSON.stringify({
      'event_type': 'smoke-tests',
      'client_payload': {
        'foo': 'bla'
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.everest-preview+json'
    },
  })
  .then(res => res.json());

console.log(json)
})().catch((e) => {
  console.log(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
