import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/', checkSession, async function (req, res, next) {

  const usersData = await User.findAll();
  console.log(usersData);

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
    user: req.session.user, // Pastikan user dari session dikirim ke template
    editUser: null // User yang akan diedit
  });
});

router.post('/add', checkSession, async function (req, res, next) {
  try {
    const { email, name, password, role } = req.body;
    if (name.trim() === '' || password.trim() === '') {
      req.flash('error', 'Please fill all fields');
      return res.redirect('/users/add');
    }
    if (await User.findByEmail(email)) {
      req.flash('error', 'Email already registered');
      return res.redirect('/users/add');
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
    const userData = await User.findById(id);
    res.render('users/formUser', {
      title: `POS - Users`,
      titlePage: `Users`,
      titleForm: `Form Edit`,
      user: req.session.user, // Pastikan user dari session dikirim ke template
      editUser: userData // User yang akan diedit
    });
  } catch (error) {
    next(error);
  }
});

router.post('/edit/:id', checkSession, async function (req, res, next) {
  const { id } = req.params;
  const { email, name, role } = req.body;
  if (name.trim() === '') {
    req.flash('error', 'Please fill all fields');
    return res.redirect(`/users/edit/${id}`);
  }
  try {
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