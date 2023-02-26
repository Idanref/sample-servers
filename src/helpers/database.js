const { validateHttpPrefix } = require('./validations');

const sendPgQuery = async (pool, query, args) => {
  const queryResponse = await pool.query(query, args);
  const result = queryResponse ? queryResponse.rows : null;

  return result; // queryResponse.rows returns an array
};

// Generate a generic SQL UPDATE query using server id,
// so that a single endpoint will handle any params combination.
const generateUpdateServerQuery = function (requestObject, server_id) {
  // Data Validation
  if ('server_id' in requestObject) delete requestObject.server_id; // id can't be updated
  if ('http_url' in requestObject) requestObject.http_url = validateHttpPrefix(requestObject.http_url); // validate http prefix

  // Will generate an SQL update format for the keys and values
  const keys = Object.keys(requestObject).join(',');
  const sqlArgs = Object.values(requestObject).map((value) => {
    if (typeof value === 'string') {
      return `'${value}'`;
    } else return value;
  });

  // Return final query.
  // If object contains 1 property, it needs to be sent without parenthesis in SQL.
  const keysLength = Object.keys(requestObject).length;

  if (keysLength <= 0) throw 'Request body length must be positive';
  else {
    const left = keysLength > 1 ? '(' : '';
    const right = keysLength > 1 ? ')' : '';

    return `UPDATE servers SET 
    ${left}${keys}${right} = ${left}${sqlArgs}${right} 
    WHERE server_id = ${server_id} RETURNING *;`;
  }
};

module.exports = {
  sendPgQuery,
  generateUpdateServerQuery,
};
