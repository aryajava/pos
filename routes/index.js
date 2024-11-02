import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import Dashboard from '../models/Dashboard.js';
import moment from 'moment/moment.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async function (req, res, next) {
    res.render('index', {
      user: req.session.user,
      title: `Dashboard`,
      titlePage: `Dashboard`,
      titleForm: `Date Settings`,
    });
  });

  // list monthly earnings
  router.get('/api/monthlyearnings', checkSession, async function (req, res, next) {
    try {
      let { startdate, enddate } = req.query;
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

  // revenue sources
  router.get('/api/revenuesources', async function (req, res, next) {
    try {
      const { startdate, enddate } = req.query;
      const data = await Dashboard.getRevenueSources(pool, { startdate, enddate });
      res.status(200).json({ data });
    } catch (error) {
      error.message = "Error getRevenueSources: " + error.message;
      next(error);
    };
  });

  // financial summary
  router.get('/api/summary', async function (req, res, next) {
    try {
      const data = await Dashboard.getFinancialSummary(pool);
      res.status(200).json({ data });
    } catch (error) {
      error.message = "Error getFinancialSummary: " + error.message;
      next(error);
    };
  });

  return router;
};