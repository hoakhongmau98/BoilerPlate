import { Response } from 'express';
import { AggregateError, ValidationError } from 'sequelize';
import { getConsoleLogger } from '@libs/consoleLogger';
import { FailValidation } from './errors';

const errorLogger = getConsoleLogger('errorLogging');
const socketOutboundLogger = getConsoleLogger('inboundLogging');
errorLogger.addContext('requestType', 'HttpLogging');
socketOutboundLogger.addContext('requestType', 'SocketLogging');

export const sendSuccess = (res: Response, data: { [key: string]: any }, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res: Response, code: number, error: any, errorSubject?: Error) => {
  if (errorSubject) {
    errorLogger.error(errorSubject);
  }

  if (errorSubject instanceof ValidationError) {
    return res.status(422).json({
      success: false,
      error: FailValidation((errorSubject.errors)),
      timestamp: new Date().toISOString(),
    });
  }

  if (errorSubject instanceof AggregateError) {
    const validationErrorItems = errorSubject.errors.map((errorGroups: any) => errorGroups.errors).map((singleError) => singleError.errors);
    return res.status(422).json({
      success: false,
      error: FailValidation(validationErrorItems.flat()),
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(code).json({
    success: false,
    error: {
      message: error,
      code: code,
    },
    timestamp: new Date().toISOString(),
  });
};
