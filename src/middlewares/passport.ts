import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import settings from '@configs/settings';
import { Request } from 'express';
import User from '@models/users';
const UserjwtOptions = { 'passReqToCallback': true, 'jwtFromRequest': ExtractJwt.fromAuthHeaderAsBearerToken(), 'secretOrKey': settings.jwt.userSecret };
const userPassport = new Passport();
const strategy = new Strategy(UserjwtOptions, async (req: Request, jwtPayload: { id: number }, next: any) => {
  try {
    const user = await User.findByPk(jwtPayload.id);
    if (user) {
      req.currentUser = user;
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.log(error);
  }
});
userPassport.use(strategy);
export {
  userPassport,
};
