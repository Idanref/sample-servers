const axios = require('axios');
const { printJobActivity } = require('./utilities');
const { sendServerDownEmail } = require('../helpers/email');

const REQUESTS_FOR_SUCCESS = 5;
const REQUESTS_FOR_FAILURE = 3;
const BASE_URI = process.env.BASE_URI;

const statusCheckJob = async function () {
  try {
    const responseAllServers = await axios.get(`${BASE_URI}/servers/all`);
    const allServers = responseAllServers.data.data;

    allServers.forEach(async (server) => {
      const { server_id } = server;

      // Get last REQUESTS_FOR_SUCCESS history entries
      const responseServerHistory = await axios.get(`${BASE_URI}/history/specific/${server.server_id}?count=${REQUESTS_FOR_SUCCESS}`);

      const serverHistory = responseServerHistory.data.data;

      // If server doesn't have more than REQUESTS_FOR_SUCCESS requests, will set to false (because healthiness can't be determined) and move automatically to the next iteration.
      if (serverHistory.length < REQUESTS_FOR_SUCCESS && server.is_healthy) {
        await axios.put(`${BASE_URI}/servers/update/${server_id}`, {
          is_healthy: false,
        });
        printJobActivity('STATUS_CHECK_JOB', 'is_healthy', 'false', server_id);
        sendServerDownEmail(server_id, server.name, server.http_url);
        return;
      }

      let successfulRequestsCounter = 0;
      let failedRequestsCounter = 0;

      // Iterate through each all the server's requests and count successful and failed requests
      for (const entry of serverHistory) {
        if (entry.success === true) successfulRequestsCounter++;
        else failedRequestsCounter++;
      }

      // Will skip the PUT request if server is already healthy (nothing to change).
      if (successfulRequestsCounter === REQUESTS_FOR_SUCCESS && !server.is_healthy) {
        await axios.put(`${BASE_URI}/servers/update/${server_id}`, {
          is_healthy: true,
        });
        printJobActivity('STATUS_CHECK_JOB', 'is_healthy', 'true', server_id);
      }

      // Will skip the PUT request if server is already not healthy (nothing to change).
      else if (failedRequestsCounter >= REQUESTS_FOR_FAILURE && server.is_healthy) {
        await axios.put(`${BASE_URI}/servers/update/${server_id}`, {
          is_healthy: false,
        });
        printJobActivity('STATUS_CHECK_JOB', 'is_healthy', 'false', server_id);
        sendServerDownEmail(server_id, server.name, server.http_url);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  statusCheckJob,
};
