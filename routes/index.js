import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import Dashboard from '../models/Dashboard.js';
import moment from 'moment/moment.js';
import XLSX from 'xlsx';
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

  // summary report
  router.get('/api/summary/reportcsv', async (req, res) => {
    try {
      let { startdate, enddate } = req.query;
      const reportData = await Dashboard.getMonthlyEarning(pool, { startdate, enddate });
      reportData.forEach((item) => {
        item.date = moment(item.date).format('MMM YY');
        item.expense = parseInt(item.expense);
        item.revenue = parseInt(item.revenue);
        item.earning = parseInt(item.earning);
      });
      const worksheet = XLSX.utils.json_to_sheet(reportData, { header: ['date', 'expense', 'revenue', 'earning'] });
      worksheet['A1'].v = 'Month';
      worksheet['B1'].v = 'Expense';
      worksheet['C1'].v = 'Revenue';
      worksheet['D1'].v = 'Earning';
      const workbook = XLSX.utils.book_new();
      let sd, ed, filename = new String();
      filename = `monthly-report-${moment().format("YYYY")}`;
      if (startdate || enddate) {
        if (startdate && !enddate) {
          sd = moment(startdate).format('MMM');
          ed = moment(reportData[reportData.length - 1].date, 'MMM YY').format('MMM');
          filename = `monthly-report-${moment().format("YYYY")}-${sd}-${ed}`;
        } else if (!startdate && enddate) {
          sd = moment(reportData[0].date, 'MMM YY').format('MMM');
          ed = moment(enddate).format('MMM');
          filename = `monthly-report-${moment().format("YYYY")}-${sd}-${ed}`;
        } else {
          sd = moment(startdate).format('MMM');
          ed = moment(enddate).format('MMM');
          filename = `monthly-report-${moment().format("YYYY")}-${sd}-${ed}`;
        }
      }
      XLSX.utils.book_append_sheet(workbook, worksheet, filename);
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'csv' });
      res.header('Content-Type', 'text/csv');
      res.attachment(`${filename}.csv`);
      res.send(buffer);
    } catch (error) {
      console.error('Error generating report CSV:', error);
      res.status(500).json({ error: 'Failed to generate report CSV' });
    }
  });

  return router;
};