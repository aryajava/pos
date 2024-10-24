import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { userFormAddValidation, userFormUpdateValidation } from '../middlewares/userValidation.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/', checkSession, async function (req, res, next) {
  const usersData = await User.findAll();
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
    error: req.flash("error"),
    success: req.flash("success"),
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
    if (await User.findByEmail(email)) {
      req.flash('error', 'Email already registered');
      return res.status(409).redirect('/users/add');
    }
    await User.save(email, name, password, role);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
});

router.get('/edit/:id', checkSession, async function (req, res, next) {
  const { id } = req.params;
  try {
    if (!await User.findById(id)) {
      req.flash('error', 'User not found');
      return res.status(404).redirect('/users');
    }
    const userData = await User.findById(id);
    res.render('users/formUser', {
      error: req.flash("error"),
      success: req.flash("success"),
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
    if (await User.findByEmail(email)) {
      req.flash('error', 'Email already registered');
      return res.status(409).redirect(`/users/edit/${id}`);
    }
    await User.update(email, name, role, id);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
});

// API

router.delete('/delete/:id', checkSession, async function (req, res, next) {
  const { id } = req.params;
  try {
    await User.delete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/users', checkSession, async function (req, res, next) {
  try {
    const usersData = await User.findAll();
    res.json({
      data: usersData,
    });
  } catch (error) {
    console.error("Error fetching users data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;