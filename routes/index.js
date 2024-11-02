import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import Dashboard from '../models/Dashboard.js';
import moment from 'moment/moment.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, function (req, res, next) {
    res.render('index', {
      user: req.session.user,
      title: `Dashboard`,
    });
  });

  // list monthly earnings
  router.get('/api/monthlyearnings', checkSession, async function (req, res, next) {
    try {
      const { startdate, enddate } = req.query;
      const data = await Dashboard.getMonthlyEarning(pool, { startdate, enddate });
      data.forEach((item) => {
        item.date = moment(item.date).format('MMM YY');
      });
      res.status(200).json({ data });
    } catch (error) {
      error.message = "Error getMonthlyEaring: " + error.message;
      next(error);
    };
  });

  return router;
};