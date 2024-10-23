import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
const router = express.Router();

/* GET users listing. */
router.get('/', checkSession, function (req, res, next) {
  res.render('users/listUser', {
    user: req.session.user,
    title: `Users`, description: `This is data of Users`
  });
});

router.get('/add', checkSession, function (req, res, next) {
  res.render('users/formUser', {
    baseUrl: req.url,
    user: req.session.user,
    title: `Form Add`
  });
});

export default router;