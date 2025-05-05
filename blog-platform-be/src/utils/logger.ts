import fs from 'fs';
import path from 'path';
import config from '../config';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

/**
 * Log levels with corresponding colors and symbols
 */
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

// ANSI color codes for different log levels
const colors = {
  [LogLevel.ERROR]: '\x1b[31m', // Red
  [LogLevel.WARN]: '\x1b[33m',  // Yellow
  [LogLevel.INFO]: '\x1b[36m',  // Cyan
  [LogLevel.DEBUG]: '\x1b[32m', // Green
  reset: '\x1b[0m',
};

// Symbols for different log levels
const symbols = {
  [LogLevel.ERROR]: '❌',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.DEBUG]: '🔍',
};

/**
 * Format log message with timestamp, level, and metadata
 */
const formatLogMessage = (
  level: LogLevel,
  message: string,
  meta: Record<string, any> = {}
): string => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length 
    ? `\n${JSON.stringify(meta, null, 2)}`
    : '';
  
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

/**
 * Write log to console with colors and to file
 */
const log = (
  level: LogLevel,
  message: string,
  meta: Record<string, any> = {}
): void => {
  const formattedMessage = formatLogMessage(level, message, meta);
  const coloredMessage = `${colors[level]}${symbols[level]} ${formattedMessage}${colors.reset}`;
  
  // Console output with colors
  console.log(coloredMessage);
  
  // File output (without colors)
  if (config.SERVER.NODE_ENV !== 'test') {
    const logStream = fs.createWriteStream(combinedLogPath, { flags: 'a' });
    logStream.write(`${formattedMessage}\n`);
    logStream.end();
    
    // Also write errors to error log
    if (level === LogLevel.ERROR) {
      const errorStream = fs.createWriteStream(errorLogPath, { flags: 'a' });
      errorStream.write(`${formattedMessage}\n`);
      errorStream.end();
    }
  }
};

/**
 * Logger interface with methods for each log level
 */
const logger = {
  error: (message: string, meta: Record<string, any> = {}) => 
    log(LogLevel.ERROR, message, meta),
  
  warn: (message: string, meta: Record<string, any> = {}) => 
    log(LogLevel.WARN, message, meta),
  
  info: (message: string, meta: Record<string, any> = {}) => 
    log(LogLevel.INFO, message, meta),
  
  debug: (message: string, meta: Record<string, any> = {}) => {
    // Only log debug in development and test environments
    if (config.SERVER.NODE_ENV !== 'production') {
      log(LogLevel.DEBUG, message, meta);
    }
  },
  
  /**
   * Log request information for API monitoring
   */
  request: (req: any, res: any, responseTime: number) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress,
    };
    
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} (${responseTime}ms)`;
    const level = res.statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    
    log(level, message, meta);
  },
};

export default logger; 