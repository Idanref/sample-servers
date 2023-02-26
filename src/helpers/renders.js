const renderResponse = function (res, status, message, data) {
  res.status(status).json({ status, message, data });
};

const renderError = function (res, error) {
  // Error handling for postgres is treated specially.
  // If error is not recognized, render internal server error instead.
  const postgresStatusCode = error.code;

  if (!postgresStatusCode) {
    return renderResponse(res, 500, 'Internal server error', error);
  }

  switch (postgresStatusCode) {
    case '42P01':
      renderResponse(res, 404, 'Resource not found', error);
      break;
    case '23505':
      renderResponse(res, 400, 'Resource already exists', error);
    case '23502':
      renderResponse(res, 400, 'A resource specified cannot be null', error);
    case '23503':
      renderResponse(res, 400, 'Foreign key violation', error);
    default:
      renderResponse(res, 500, 'Internal server error', error);
  }
};

module.exports = {
  renderResponse,
  renderError,
};
