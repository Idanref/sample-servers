// Will console.log when server/history entry status is set to a new value to keep track of the server activity while site is deployed.
const printJobActivity = function (job, key, value, serverId) {
  console.log(`${job}: Set {'${key}': ${value}} for server_id: ${serverId}`);
};

module.exports = {
  printJobActivity,
};
