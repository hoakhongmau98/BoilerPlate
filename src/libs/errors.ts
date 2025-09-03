import { ValidationErrorItem } from 'sequelize';

export const FailValidation = (errors: ValidationErrorItem[]) => {
  const messages: any = {};
  errors.forEach((error) => {
    // Handle both legacy and new Sequelize error structures
    const path = (error as any)?.path || error.path || 'unknown';
    const message = (error as any)?.message || error.message || 'Validation error';

    if (path && message) {
      messages[path] = messages[path] || [];
      messages[path].push(message);
    }
  });
  return {
    code: 120,
    messages,
  };
};

export const NoData = {
  code: 8,
  message: 'No data available',
};

export const InternalError = {
  code: 131,
  message: 'Internal error',
};

export const BadAuthentication = {
  code: 215,
  message: 'Bad authentication data',
};

export const MemberNotFound = {
  code: 301,
  message: 'Entered member code is invalid',
};

export const NoAccessPermission = {
  code: 305,
  message: 'You do not have permission to access this page',
};

export const FileNotAccepted = {
  code: 325,
  message: 'Type of file is not allowed',
};

export const AssetbeingUsed = {
  code: 335,
  message: 'Include at least one asset being used',
};
