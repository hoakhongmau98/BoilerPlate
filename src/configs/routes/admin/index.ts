import { Router } from 'express';
// import { userPassport } from '@middlewares/passport';
import UsersRouter from './Users';

const router = Router();
router.use('/users', UsersRouter);
// router.use('/users', userPassport.authenticate('jwt', { session: false }), UsersRouter);

export default router;
