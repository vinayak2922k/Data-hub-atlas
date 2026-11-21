const methodColors = {
  GET: '\x1b[32m',
  POST: '\x1b[34m',
  PUT: '\x1b[33m',
  DELETE: '\x1b[31m',
  PATCH: '\x1b[35m',
};

const getStatusColor = (status) => {
  if (status >= 500) return '\x1b[31m';
  if (status >= 400) return '\x1b[33m';
  if (status >= 300) return '\x1b[36m';
  return '\x1b[32m';
};

const reset = '\x1b[0m';
const dim = '\x1b[2m';
const bold = '\x1b[1m';

const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2);
    const methodColor = methodColors[req.method] || '\x1b[37m';
    const statusColor = getStatusColor(res.statusCode);

    console.log(
      `${dim}[${new Date().toISOString()}]${reset} ` +
      `${bold}${methodColor}${req.method.padEnd(6)}${reset} ` +
      `${req.originalUrl || req.url} ` +
      `${statusColor}${res.statusCode}${reset} ` +
      `${dim}${durationMs}ms${reset}`
    );
  });

  next();
};

module.exports = requestLogger;
