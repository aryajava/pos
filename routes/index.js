import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, function (req, res, next) {
    res.render('index', {
      user: req.session.user,
      title: `Dashboard`,
    });
  });

  return router;
};