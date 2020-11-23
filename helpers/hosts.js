var hostile = require('hostile');
const util = require('util');
const setHostEntry = util.promisify(hostile.set.bind(hostile));
const removeHostEntry = util.promisify(hostile.remove.bind(hostile));

module.exports = {
  setHostEntry,
  removeHostEntry
};