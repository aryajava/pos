import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import flash from 'connect-flash';
import session from 'express-session';
import fileupload from 'express-fileupload';
import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config();

const app = express();

// Inisialisasi pool
export const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.message);
  }
});

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/vendor", express.static(path.join(__dirname, "public/vendor")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  next();
});

app.use(sessionMiddleware);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});

app.use(
  fileupload({
    createParentPath: true,
  })
);

import authRouter from './routes/auth.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import unitsRouter from './routes/units.js';
import goodsRouter from './routes/goods.js';
import suppliersRouter from './routes/suppliers.js';
import purchasesRouter from './routes/purchases.js';
import customersRouter from './routes/customers.js';
import salesRouter from './routes/sales.js';

app.use('/', authRouter(pool));
app.use('/dashboard', indexRouter(pool));
app.use('/users', usersRouter(pool));
app.use('/units', unitsRouter(pool));
app.use('/goods', goodsRouter(pool));
app.use('/suppliers', suppliersRouter(pool));
app.use('/purchases', purchasesRouter(pool));
app.use('/customers', customersRouter(pool));
app.use('/sales', salesRouter(pool));

app.use(function (_, __, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;