import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import session from 'express-session';
const router = express.Router();

/* GET home page. */
router.get('/', checkSession, function (req, res, next) {
  res.render('index', {
    user: req.session.user,
    title: `Dashboard`,
  });
});

export default router;