const validateHttpPrefix = function (http_url) {
  if (!(http_url.startsWith('http://') || http_url.startsWith('https://'))) {
    return `http://${http_url}`;
  }

  return http_url;
};

module.exports = {
  validateHttpPrefix,
};
