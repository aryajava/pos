import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { customerFormAddValidation, customerFormUpdateValidation } from '../middlewares/formValidation.js';
import Customer from '../models/Customer.js';
const router = express.Router();


export default (pool) => {

  router.get('/', checkSession, async (req, res) => {
    const customerData = await Customer.findAll(pool);
    res.render('customers/listCustomer', {
      user: req.session.user,
      title: 'POS - Customers',
      titlePage: 'Customers',
      description: 'This is data of Customers',
      customerData,
    });
  });

  router.get('/add', checkSession, async (req, res) => {
    try {
      res.render('customers/formCustomer', {
        user: req.session.user,
        title: 'POS - Add Customer',
        titlePage: 'Customer',
        titleForm: 'Form Add',
        description: 'This is Add Customer Page',
        customerData: null,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/add', checkSession, customerFormAddValidation, async (req, res) => {
    const { name, address, phone } = req.body;
    try {
      const newCustomer = new Customer(pool, null, name, address, phone);
      await Customer.save(newCustomer);
      res.redirect('/customers');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/edit/:id', checkSession, async (req, res) => {
    const { id } = req.params;
    try {
      const customerData = await Customer.findById(pool, id);
      if (!customerData) {
        req.flash('error', 'Customer not found');
        return res.redirect('/customers');
      }
      res.render('customers/formCustomer', {
        user: req.session.user,
        title: 'POS - Edit Customer',
        titlePage: 'Customer',
        titleForm: 'Form Edit',
        description: 'Edit a customer',
        customerData,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/edit/:id', checkSession, customerFormUpdateValidation, async (req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    try {
      const customerData = new Customer(pool, id, name, address, phone);
      await Customer.update(customerData);
      res.redirect('/customers');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // API

  router.delete('/delete/:id', checkSession, async (req, res) => {
    const { id } = req.params;
    try {
      await Customer.delete(pool, id);
      res.json({ message: 'Customer deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/api/customers', checkSession, async (req, res) => {
    try {
      const searchQuery = req.query.q || '';
      const customersData = await Customer.findAll(pool, searchQuery);
      res.json({ data: customersData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};