import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { userFormAddValidation, userFormUpdateValidation } from '../middlewares/formValidation.js';
import User from '../models/User.js';
const router = express.Router();

export default (pool) => {

  router.get('/', checkSession, async function (req, res, next) {
    const usersData = await User.findAll(pool);
    res.render('users/listUser', {
      user: req.session.user,
      title: `POS - Users`,
      titlePage: `Users`,
      description: `This is data of Users`,
      usersData,
    });
  });

  router.get('/add', checkSession, function (req, res, next) {
    res.render('users/formUser', {
      title: `POS - Users`,
      titlePage: `Users`,
      titleForm: `Form Add`,
      user: req.session.user,
      userData: null
    });
  });

  router.post('/add', checkSession, userFormAddValidation, async function (req, res, next) {
    try {
      const { email, name, password, role } = req.body;
      if (await User.findByEmail(pool, email)) {
        req.flash('error', 'Email already registered');
        return res.status(409).redirect('/users/add');
      }
      const newUser = new User(pool, email, name, password, role);
      await User.save(pool, newUser);
      res.redirect('/users');
    } catch (error) {
      next(error);
    }
  });

  router.get('/edit/:id', checkSession, async function (req, res, next) {
    const { id } = req.params;
    try {
      const userData = await User.findById(pool, id);
      if (!userData) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/users');
      }
      res.render('users/formUser', {
        title: `POS - Users`,
        titlePage: `Users`,
        titleForm: `Form Edit`,
        user: req.session.user,
        userData
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/edit/:id', checkSession, userFormUpdateValidation, async function (req, res, next) {
    const { id } = req.params;
    const { email, name, role } = req.body;

    try {
      const existingUser = await User.findById(pool, id);
      if (existingUser.email === email) {
        const userData = { email, name, role };
        await User.update(pool, userData, id);
        return res.redirect('/users');
      }
      if (await User.findByEmail(pool, email)) {
        req.flash('error', 'Email already registered');
        return res.status(409).redirect(`/users/edit/${id}`);
      }
      const userData = { email, name, role };
      await User.update(pool, userData, id);
      res.redirect('/users');
    } catch (error) {
      next(error);
    }
  });

  // API

  router.delete('/delete/:id', checkSession, async function (req, res, next) {
    const { id } = req.params;
    try {
      await User.delete(pool, id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/api/users', checkSession, async function (req, res, next) {
    try {
      const usersData = await User.findAll(pool);
      res.json({
        data: usersData,
      });
    } catch (error) {
      console.error("Error fetching users data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};