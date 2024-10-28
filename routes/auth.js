import express from 'express';
import bcrypt from 'bcrypt';
import Auth from '../models/Auth.js';
import { checkSessionAuth } from '../middlewares/checkSession.js';
import { authLoginValidation, authRegisterValidation } from '../middlewares/formValidation.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSessionAuth, function (req, res, next) {
    res.render('auth/login', { title: 'Login', error: req.flash("error"), success: req.flash("success") });
  });

  router.get('/register', checkSessionAuth, function (req, res, next) {
    res.render('auth/register', { title: 'Register' });
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
  });

  router.post('/', checkSessionAuth, authLoginValidation, async function (req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await Auth.findByEmail(pool, email);
      if (!user || user.email !== email) {
        req.flash("error", "Email or Password is wrong");
        return res.redirect("/");
      }
      if (!bcrypt.compareSync(password, user.password)) {
        req.flash("error", "Email or Password is wrong");
        return res.redirect("/");
      }
      req.session.user = user;
      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
      req.flash("error", "An unexpected error occurred");
      res.redirect("/");
    }
  });

  router.post("/register", checkSessionAuth, authRegisterValidation, async (req, res) => {
    const { email, password, retype } = req.body;
    if (password !== retype) {
      req.flash("error", "Password does not match");
      res.redirect("/register");
      return;
    }
    if (password.trim() === "") {
      req.flash("error", "Password is required");
      res.redirect("/register");
      return;
    }
    try {
      const user = await Auth.findByEmail(pool, email);
      if (user) {
        req.flash("error", "Email already registered");
        res.redirect("/register");
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        await new Auth(pool, email, hashedPassword).save();
        req.flash("success", "Registration successful. Please sign in.");
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      req.flash("error", "An unexpected error occurred");
      res.redirect("/register");
    }
  });

  return router;
};