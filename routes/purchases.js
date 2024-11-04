import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { purchaseFormValidation, purchaseItemFormValidation } from '../middlewares/formValidation.js';
import Purchase from '../models/Purchase.js';
import PurchaseItem from '../models/PurchaseItem.js';
import moment from 'moment/moment.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async function (req, res) {
    delete req.session.currentInvoice;
    const purchasesData = await Purchase.findAll(pool);
    res.render('purchases/listPurchase', {
      user: req.session.user,
      title: 'POS - Purchases',
      titlePage: 'Purchases',
      description: 'This is data of Purchases',
      purchasesData,
    });
  });

  router.get('/add', checkSession, async function (req, res) {
    const operator = req.session.user.id;
    let invoice = req.session.currentInvoice;
    if (!invoice) {
      const newPurchase = new Purchase(pool, null, operator);
      try {
        const createdPurchase = await Purchase.create(newPurchase);
        invoice = createdPurchase.invoice;
        req.session.currentInvoice = invoice;
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    try {
      const purchaseData = await Purchase.findbyInvoice({ pool, invoice });
      res.render('purchases/formPurchase', {
        user: req.session.user,
        title: 'POS - Add Purchases',
        titlePage: 'Purchases',
        titleForm: 'Transaction',
        description: 'This is form to add Purchases',
        isEdit: false,
        purchaseData: { ...purchaseData, time: moment(purchaseData.time).format('DD MMM YYYY HH:mm:ss') },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/edit/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const purchaseData = await Purchase.findbyInvoice({ pool, invoice });
      res.render('purchases/formPurchase', {
        user: req.session.user,
        title: 'POS - Edit Purchases',
        titlePage: 'Purchases',
        titleForm: 'Transaction',
        description: 'This is form to edit Purchases',
        isEdit: true,
        purchaseData: { ...purchaseData, time: moment(purchaseData.time).format('DD MMM YYYY HH:mm:ss') }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // list purchases
  router.get('/api/purchases', checkSession, async function (req, res) {
    try {
      const purchasesData = await Purchase.findAll(pool);
      purchasesData.forEach(purchase => {
        purchase.time = moment(purchase.time).format('DD MMM YYYY HH:mm:ss');
      });
      res.json({ data: purchasesData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // get purchase by invoice
  router.get('/api/purchase/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const purchaseData = await Purchase.findbyInvoice({ pool, invoice });
      res.json({ data: purchaseData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // save and update purchase
  router.put('/api/purchase/:invoice', checkSession, purchaseFormValidation, async function (req, res) {
    const { invoice, supplier } = req.body;
    try {
      await Purchase.update(pool, invoice, { supplier });
      res.json({ success: true, message: 'Purchase successfully updated' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // delete purchase
  router.delete('/delete/:invoice', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      await Purchase.delete(pool, invoice);
      res.json({ success: true, message: 'Purchase successfully deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // get list purchase item by invoice
  router.get('/api/purchase/:invoice/items', checkSession, async function (req, res) {
    const invoice = req.params.invoice;
    try {
      const purchaseData = await PurchaseItem.findAllByInvoice(pool, invoice);
      res.json({ data: purchaseData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // add item to purchase
  router.post('/api/purchase/:invoice/item', checkSession, purchaseItemFormValidation, async function (req, res) {
    const { invoice, itemcode, quantity, purchaseprice, totalprice } = req.body;
    try {
      await PurchaseItem.addItem(pool, { invoice, itemcode, quantity, purchaseprice, totalprice });
      res.json({ success: true, message: 'Item successfully added' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // delete item from purchase
  router.delete('/api/purchase/:invoice/item/:id', checkSession, async function (req, res) {
    const { id } = req.params;
    try {
      const deletedItem = await PurchaseItem.deleteItem(pool, parseInt(id));
      if (!deletedItem) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.json({ success: true, message: 'Item successfully deleted' });
    } catch (error) {
      console.error(`Error deleting item: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  return router
}