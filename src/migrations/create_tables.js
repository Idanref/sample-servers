const pool = require('../db/postgres');
const { sendPgQuery } = require('../helpers/database');

const createServersTable = `
CREATE TABLE IF NOT EXISTS servers (
  server_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  http_url VARCHAR(255) UNIQUE NOT NULL,
  is_healthy BOOLEAN DEFAULT FALSE
);`;

const createHistoryTable = `
CREATE TABLE IF NOT EXISTS history (
  request_id SERIAL PRIMARY KEY,
  success BOOLEAN,
  server_id SERIAL,
  CONSTRAINT fk_servers_history
  FOREIGN KEY(server_id) REFERENCES servers(server_id)
);`;

const createTablesIfNotExist = async function () {
  try {
    await sendPgQuery(pool, createServersTable);
    await sendPgQuery(pool, createHistoryTable);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  createTablesIfNotExist,
};
