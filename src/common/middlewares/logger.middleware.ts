import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (res.statusCode >= 500) {
        this.logger.error(
          `${req.method} ${req.originalUrl} ${res.statusCode}`,
          {
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
          },
        );
      } else if (res.statusCode >= 400) {
        this.logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
          ip: req.ip,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
        });
      } else {
        this.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
          ip: req.ip,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
        });
      }
    });
    next();
  }
}
