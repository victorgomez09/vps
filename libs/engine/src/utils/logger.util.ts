import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  level: 'info',
  transports: [],
});

// Console Transport
logger.add(
  new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        (info) => `${info['timestamp']} ${info.level}: ${info.message}`
      )
    ),
  })
);

// File Transport
logger.add(new transports.File({ filename: 'error.log' }));
