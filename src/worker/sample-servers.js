const now = require('performance-now');
const axios = require('axios');
const { printJobActivity } = require('./utilities');

const BASE_URI = process.env.BASE_URI;
const SECONDS_UNTIL_FAILURE = 60;

const sampleServersJob = async function () {
  try {
    const responseAllServers = await axios.get(`${BASE_URI}/servers/all`);
    const allServers = responseAllServers.data.data;

    allServers.forEach(async (server) => {
      const { http_url, server_id } = server;
      const start = now(); // in miliseconds

      try {
        const responseSampleServer = await axios.get(http_url);

        const end = now(); // in miliseconds
        const httpResponseLatency = (end - start) / 1000; // in seconds

        if (httpResponseLatency < SECONDS_UNTIL_FAILURE && responseSampleServer.statusText === 'OK') {
          // Conditions are met, set success
          await axios.post(`${BASE_URI}/history/create`, {
            server_id,
            success: true,
          });
          printJobActivity('SAMPLE_JOB', 'success', 'true', server_id);
        } else {
          // Conditions are not met, set failure
          await axios.post(`${BASE_URI}/history/create`, {
            server_id,
            success: false,
          });
          printJobActivity('SAMPLE_JOB', 'success', 'false', server_id);
        }
      } catch (error) {
        // In case of error in GET web server (for example when the server does not exist) - set success to 'false'
        await axios.post(`${BASE_URI}/history/create`, {
          server_id,
          success: false,
        });
        printJobActivity('SAMPLE_JOB', 'success', 'false', server_id);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  sampleServersJob,
};
