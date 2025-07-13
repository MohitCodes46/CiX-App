const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: this.getTimestamp(),
      level,
      message,
      ...meta
    }) + '\n';
  }

  writeToFile(filename, content) {
    const filepath = path.join(this.logDir, filename);
    fs.appendFileSync(filepath, content);
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('INFO', message, meta);
    console.log(`[INFO] ${message}`, meta);
    this.writeToFile('info.log', formattedMessage);
  }

  error(message, meta = {}) {
    const formattedMessage = this.formatMessage('ERROR', message, meta);
    console.error(`[ERROR] ${message}`, meta);
    this.writeToFile('error.log', formattedMessage);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('WARN', message, meta);
    console.warn(`[WARN] ${message}`, meta);
    this.writeToFile('warn.log', formattedMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, meta);
      console.debug(`[DEBUG] ${message}`, meta);
      this.writeToFile('debug.log', formattedMessage);
    }
  }

  // Log API requests
  logRequest(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.info('API Request', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    });

    next();
  }

  // Log errors
  logError(error, req = null) {
    this.error('Application Error', {
      message: error.message,
      stack: error.stack,
      url: req?.url,
      method: req?.method,
      ip: req?.ip
    });
  }
}

module.exports = new Logger();
