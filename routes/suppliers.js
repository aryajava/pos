import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import Supplier from '../models/Supplier.js';
import { supplierFormAddValidation, supplierFormUpdateValidation } from '../middlewares/formValidation.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async (req, res) => {
    const suppliersData = await Supplier.findAll(pool);
    res.render('suppliers/listSupplier', {
      user: req.session.user,
      title: 'POS - Suppliers',
      titlePage: 'Suppliers',
      description: 'This is data of Suppliers',
      suppliersData,
    });
  });

  router.get('/add', checkSession, async (req, res) => {
    try {
      res.render('suppliers/formSupplier', {
        user: req.session.user,
        title: 'POS - Suppliers',
        titlePage: 'Supplier',
        titleForm: `Form Add`,
        description: 'Add a new supplier',
        supplierData: null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/add', checkSession, supplierFormAddValidation, async (req, res) => {
    try {
      const { name, address, phone } = req.body;
      const newSupplier = new Supplier(pool, name, address, phone);
      await Supplier.save(pool, newSupplier);
      res.redirect('/suppliers');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/edit/:id', checkSession, async (req, res) => {
    const { id } = req.params;
    try {
      const supplierData = await Supplier.findById(pool, id);
      if (!supplierData) {
        req.flash("error", "Supplier not found");
        return res.redirect('/suppliers');
      }
      res.render('suppliers/formSupplier', {
        user: req.session.user,
        title: 'POS - Suppliers',
        titlePage: 'Supplier',
        titleForm: `Form Edit`,
        description: 'Edit a supplier',
        supplierData,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/edit/:id', checkSession, supplierFormUpdateValidation, async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    try {
      if (!await Supplier.findById(pool, id)) {
        req.flash("error", "Supplier not found");
        return res.redirect('/suppliers');
      }
      const newSupplier = new Supplier(pool, name, address, phone);
      await Supplier.update(pool, newSupplier, id);
      res.redirect('/suppliers');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API

  router.delete('/delete/:id', checkSession, async (req, res) => {
    const { id } = req.params;
    try {
      await Supplier.delete(pool, id);
      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/api/suppliers', checkSession, async (req, res) => {
    try {
      const searchQuery = req.query.q || '';
      const suppliersData = await Supplier.findAll(pool, searchQuery);
      res.json({ data: suppliersData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};