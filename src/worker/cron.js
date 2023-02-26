const cron = require('node-cron');
const { statusCheckJob } = require('./status-check');
const { sampleServersJob } = require('./sample-servers');

// Scheduling every 30 seconds
const initiateSchedulingJobs = function () {
  cron.schedule('*/30 * * * * *', () => {
    sampleServersJob();
    statusCheckJob();
  });
};

module.exports = {
  initiateSchedulingJobs,
};
