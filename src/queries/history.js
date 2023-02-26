const getLastRequestsFromHistoryByServerId =
  'SELECT request_id, h.server_id, h.success FROM servers s JOIN history h USING(server_id) WHERE h.server_id = $1 ORDER BY request_id DESC LIMIT $2';

const createNewHistoryRequest = 'INSERT INTO history (server_id, success) VALUES ($1, $2) RETURNING *;';

const deleteHistoryByServerId = 'DELETE FROM history WHERE server_id = $1;';

module.exports = {
  getLastRequestsFromHistoryByServerId,
  createNewHistoryRequest,
  deleteHistoryByServerId,
};
