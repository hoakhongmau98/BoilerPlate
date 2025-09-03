import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import UserModel from '@models/users';
import { NoData } from '@libs/errors';

class UserController {
  public async show (req: Request, res: Response) {
    try {
      const scopes: any = [
        // 'withDepartmentName',
        // 'withPositionName',
      ];
      const user = await UserModel.scope(scopes).findByPk(req.params.userId);
      if (!user) {
        return sendError(res, 404, NoData);
      }
      return sendSuccess(res, user);
    } catch (error) {
      return sendError(res, 500, error instanceof Error ? error.message : 'Unknown error', error);
    }
  }
}

export default new UserController();
