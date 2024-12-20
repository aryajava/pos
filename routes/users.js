import express from 'express';
import bcrypt from 'bcrypt';
import { checkSession } from '../middlewares/checkSession.js';
import { checkRoleOperator } from '../middlewares/checkOwnership.js';
import { userChangePasswordValidation, userFormAddValidation, userFormUpdateValidation, userProfileValidation } from '../middlewares/formValidation.js';
import User from '../models/User.js';
const router = express.Router();

export default (pool) => {

  router.get('/', checkSession, checkRoleOperator, async function (req, res, next) {
    const usersData = await User.findAll(pool);
    res.render('users/listUser', {
      user: req.session.user,
      title: `POS - Users`,
      titlePage: `Users`,
      description: `This is data of Users`,
      usersData,
    });
  });

  router.get('/add', checkSession, checkRoleOperator, function (req, res, next) {
    res.render('users/formUser', {
      title: `POS - Users`,
      titlePage: `Users`,
      titleForm: `Form Add`,
      user: req.session.user,
      userData: null
    });
  });

  router.post('/add', checkSession, checkRoleOperator, userFormAddValidation, async function (req, res, next) {
    try {
      const { email, name, password, role } = req.body;
      if (await User.findByEmail(pool, email)) {
        req.flash('error', 'Email already registered');
        return res.status(409).redirect('/users/add');
      }
      const newUser = { email, name, password, role };
      const savedUser = await User.save(pool, newUser);
      const userData = {
        userid: savedUser.userid,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role
      };
      req.app.get('io').emit('userAdded', userData);
      res.redirect('/users');
    } catch (error) {
      next(error);
    }
  });

  router.get('/edit/:id', checkSession, checkRoleOperator, async function (req, res, next) {
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

  router.post('/edit/:id', checkSession, checkRoleOperator, userFormUpdateValidation, async function (req, res, next) {
    const { id } = req.params;
    const { email, name, role } = req.body;
    const sessionUser = req.session.user;
    try {
      const existingUser = await User.findById(pool, id);
      if (existingUser.email === email) {
        const userData = { email, name, role };
        await User.update(pool, userData, id);
        const updatedUser = await User.findById(pool, id);
        req.app.get('io').emit('userUpdated', updatedUser);
        return res.redirect('/users');
      }
      if (await User.findByEmail(pool, email)) {
        req.flash('error', 'Email already registered');
        return res.status(409).redirect(`/users/edit/${id}`);
      }
      const userData = { email, name, role };
      const newUser = await User.update(pool, userData, id);

      if (sessionUser.id === parseInt(id)) {
        req.session.user = { ...req.session.user, email: newUser.email, name: newUser.name, role: newUser.role };
      }
      req.app.get('io').emit('userUpdated', newUser);
      res.redirect('/users');
    } catch (error) {
      next(error);
    }
  });

  router.get('/profile', checkSession, async function (req, res, next) {
    const { id, email, name } = req.session.user;
    res.render('users/profile', {
      title: `POS - Users Profile`,
      titlePage: `Profile`,
      titleForm: `Your Profile`,
      user: req.session.user,
      profile: true,
      userData: { id, email, name }
    });
  });

  router.post('/profile', checkSession, userProfileValidation, async function (req, res, next) {
    const { id } = req.session.user;
    const { email, name } = req.body;
    const userData = { id, email, name };

    try {
      await User.updateProfile(pool, userData);
      req.session.user = { ...req.session.user, email, name };
      req.flash('success', 'Profile updated successfully');
      req.app.get('io').emit('userUpdated', userData);
      res.redirect('/users/profile');
    } catch (error) {
      next(error);
    }
  });

  router.get('/change-password', checkSession, function (req, res, next) {
    res.render('users/profile', {
      title: `POS - Users Change Password`,
      titlePage: `Change Password`,
      titleForm: `Change Your Password`,
      user: req.session.user,
      profile: false,
      userData: null
    });
  });

  router.post('/change-password', checkSession, userChangePasswordValidation, async function (req, res, next) {
    const { id } = req.session.user;
    const { oldpassword, newpassword } = req.body;
    try {
      const getUser = await User.findById(pool, id);
      if (!bcrypt.compareSync(oldpassword, getUser.password)) {
        req.flash('error', 'Old password is incorrect');
        return res.status(400).redirect('/users/change-password');
      }
      const userData = { id, newpassword };
      await User.updatePassword(pool, userData);
      req.flash('success', 'Password updated successfully');
      res.redirect('/users/change-password');
    } catch (error) {
      next(error);
    }
  });

  // API

  router.delete('/delete/:id', checkSession, checkRoleOperator, async function (req, res, next) {
    const { id } = req.params;
    try {
      await User.delete(pool, id);
      req.app.get('io').emit('userDeleted', { id });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/api/users', checkSession, checkRoleOperator, async function (req, res, next) {
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