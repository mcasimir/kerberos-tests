const execa = require('execa');

async function kinit(user, password) {
  try { // hemdal
    await execa('kinit',
      ['--password-file=STDIN', user], {input: `${password}`});
  } catch (e) { // mit
    await execa(
      'kinit', [user], {input: `${password}`});
  }
}

async function kdestroy() {
  try {
    await execa('kdestroy');
  } catch (e) {
    //
  }
}

module.exports = {
  kinit,
  kdestroy
}