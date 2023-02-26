// External Modules
const pool = require('../db/postgres');
// Helpers
const { sendPgQuery } = require('../helpers/database');
const { renderResponse, renderError } = require('../helpers/renders');
// Queries
const historyQueries = require('../queries/history');

const getLastHistoryByServerId = async (req, res) => {
  // "LIMIT null" is treated the same as "LIMIT ALL" in PostgresSQL
  // (from postgres "sql-select" documentation)
  const count = req.query.count && req.query.count > 0 ? req.query.count : null;

  try {
    const server_id = req.params.server_id;

    const allServerHistory = await sendPgQuery(pool, historyQueries.getLastRequestsFromHistoryByServerId, [server_id, count]);

    renderResponse(res, 200, `Successfully fetched history (${count ?? 'all'} items) for server_id: ${server_id}`, allServerHistory);
  } catch (err) {
    console.error(err);
    renderError(res, err);
  }
};

const createHistoryRequest = async (req, res) => {
  try {
    if (!('server_id' in req.body) || !('success' in req.body)) {
      return renderResponse(res, 400, `'server_id' and 'success' must be provided`, {});
    }

    const { server_id, success } = req.body;

    const queryResults = await sendPgQuery(pool, historyQueries.createNewHistoryRequest, [server_id, success]);
    renderResponse(res, 200, 'Request successfully created', queryResults);
  } catch (err) {
    console.error(err);
    renderError(res, err);
  }
};

module.exports = {
  getLastHistoryByServerId,
  createHistoryRequest,
};
