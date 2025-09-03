import Parameters from "@libs/parameters";
import userModel from '@models/users';
declare global {
  namespace Express {
    interface Request {
      parameters: Parameters<any>;
      currentUser: userModel;
    }
  }
}
