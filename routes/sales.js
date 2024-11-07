import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { checkOwnershipSales } from '../middlewares/checkOwnership.js';
import { saleFormValidation, saleItemFormValidation } from '../middlewares/formValidation.js';
import moment from 'moment/moment.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import Goods from '../models/Goods.js';
import { emitRemoveStockAlertToAdmins, emitStockAlertToAdmins } from './socket.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async function (req, res) {
    delete req.session.currentInvoice;
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
    const operator = req.session.user.id;
    let invoice = req.session.currentInvoice;

    if (!invoice) {
      const newSale = new Sale(pool, null, operator);
      try {
        const createdSale = await Sale.create(newSale);
        const saleAdded = await Sale.findbyInvoice({ pool, invoice: createdSale.invoice });
        req.app.get('io').emit('saleAdded', { ...saleAdded, time: moment(saleAdded.time).format('DD MMM YYYY HH:mm:ss') });
        invoice = createdSale.invoice;
        req.session.currentInvoice = invoice;
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    try {
      const saleData = await Sale.findbyInvoice({ pool, invoice });
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

  router.get('/edit/:invoice', checkSession, checkOwnershipSales, async function (req, res) {
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
  router.get('/api/sale/:invoice', checkSession, checkOwnershipSales, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const saleData = await Sale.findbyInvoice({ pool, invoice });
      res.json({ data: saleData });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  });

  // save and update sale
  router.put('/api/sale/:invoice', checkSession, checkOwnershipSales, saleFormValidation, async function (req, res) {
    const { invoice, pay, change, customer } = req.body;
    const saleData = { pay, change, customer };
    try {
      const saleAdded = await Sale.update(pool, invoice, saleData);
      await emitStockAlertToAdmins(req.app.get('io'));
      const saleUpdated = await Sale.findbyInvoice({ pool, invoice: saleAdded.invoice });
      req.app.get('io').emit('saleUpdated', saleUpdated);
      res.json({ success: true, message: 'Sale successfully updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // delete sale
  router.delete('/delete/:invoice', checkSession, checkOwnershipSales, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const saleDeleted = await Sale.delete(pool, invoice);
      emitRemoveStockAlertToAdmins(req.app.get('io'), saleDeleted);
      req.app.get('io').emit('saleDeleted', invoice);
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
  router.post('/api/sale/:invoice/item', checkSession, saleItemFormValidation, async function (req, res) {
    const { invoice, itemcode, quantity, sellingprice, totalprice } = req.body;
    const itemData = { invoice, itemcode, quantity, sellingprice, totalprice };
    try {
      const availableStock = await SaleItem.checkStock(pool, itemcode, quantity);
      if (!availableStock) {
        req.flash('error', 'Quantity exceeds stock');
        return res.status(400).json({ success: false, message: 'Quantity exceeds stock', redirect: `/sales/edit/${invoice}` });
      }
      const addedItem = await SaleItem.addItem(pool, itemData);
      const goods = await Goods.findByBarcode(pool, itemcode);
      if (goods.stock > 5) {
        emitRemoveStockAlertToAdmins(req.app.get('io'), goods);
      }
      await emitStockAlertToAdmins(req.app.get('io'));
      res.json({ data: addedItem });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // delete item from sale
  router.delete('/api/sale/:invoice/item/:id', checkSession, async function (req, res) {
    const { id } = req.params;
    try {
      const deletedItem = await SaleItem.deleteItem(pool, parseInt(id));
      if (!deletedItem) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      const goods = await Goods.findByBarcode(pool, deletedItem.itemcode);
      if (goods.stock > 5) {
        emitRemoveStockAlertToAdmins(req.app.get('io'), goods);
      }
      await emitStockAlertToAdmins(req.app.get('io'));
      res.json({ success: true, message: 'Item successfully deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
};