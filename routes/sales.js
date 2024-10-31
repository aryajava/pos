import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import moment from 'moment/moment.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async function (req, res) {
    const salesData = await Sale.findAll(pool);
    res.render('sales/listSale', {
      user: req.session.user,
      title: 'POS - Sales',
      titlePage: 'Sales',
      description: 'This is data of Sales',
      salesData,
    });
  });

  router.get('/add', checkSession, async function (req, res) {
    const operator = req.session.user.userid;
    const newSale = new Sale(pool, null, operator);
    try {
      const createdSale = await Sale.create(newSale);
      const saleData = await Sale.findbyInvoice({ pool, invoice: createdSale.invoice });

      res.render('sales/formSale', {
        user: req.session.user,
        title: 'POS - Add Sales',
        titlePage: 'Sales',
        titleForm: 'Transaction',
        description: 'This is form to add Sales',
        saleData: { ...saleData, time: moment(saleData.time).format('DD MMM YYYY HH:mm:ss') },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/edit/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const saleData = await Sale.findbyInvoice({ pool, invoice });
      res.render('sales/formSale', {
        user: req.session.user,
        title: 'POS - Edit Sales',
        titlePage: 'Sales',
        titleForm: 'Transaction',
        description: 'This is form to edit Sales',
        saleData: { ...saleData, time: moment(saleData.time).format('DD MMM YYYY HH:mm:ss') },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // list sales
  router.get('/api/sales', checkSession, async function (req, res) {
    try {
      const salesData = await Sale.findAll(pool);
      salesData.forEach(sale => {
        sale.time = moment(sale.time).format('DD MMM YYYY HH:mm:ss');
      });
      res.json({ data: salesData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // get sale by invoice
  router.get('/api/sale/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const saleData = await Sale.findbyInvoice({ pool, invoice });
      saleData.time = moment(saleData.time).format('DD MMM YYYY HH:mm:ss');
      res.json({ data: saleData });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  });

  // save and update sale
  router.put('/api/sale/:invoice', checkSession, async function (req, res) {
    const { invoice, pay, change, customer } = req.body;
    const saleData = { pay, change, customer };
    try {
      await Sale.update(pool, invoice, saleData);
      res.json({ success: true, message: 'Sale successfully updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // delete sale
  router.delete('/delete/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      await Sale.delete(pool, invoice);
      res.json({ success: true, message: 'Sale successfully deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // get list sale item by invoice
  router.get('/api/sale/:invoice/items', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const saleItemsData = await SaleItem.findAllByInvoice(pool, invoice);
      res.json({ data: saleItemsData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // add item to sale
  router.post('/api/sale/:invoice/item', checkSession, async function (req, res) {
    const { invoice, itemcode, quantity, sellingprice, totalprice } = req.body;
    const itemData = { invoice, itemcode, quantity, sellingprice, totalprice };
    try {
      const addedItem = await SaleItem.addItem(pool, itemData);
      res.json({ data: addedItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // delete item from sale
  router.delete('/api/sale/:invoice/item/:id', checkSession, async function (req, res) {
    const { id } = req.params;
    try {
      await SaleItem.deleteItem(pool, id);
      res.json({ success: true, message: 'Item successfully deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};