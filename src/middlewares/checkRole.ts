import { sendError } from '@libs/response';
import { Request, Response } from 'express';
import { NoAccessPermission } from '@libs/errors';

const isAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const role = req.currentUser.role;
    if (role === 'admin') {
      next();
    } else {
      sendError(res, 403, NoAccessPermission);
    }
  } catch (error) {
    sendError(res, 403, error);
  }
};

export {
  isAdmin,
};
