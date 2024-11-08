import { pool } from "../app.js";
import Purchase from "../models/Purchase.js";
import Sale from "../models/Sale.js";

export const checkRoleOperator = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.redirect('/sales')
};

export const checkOwnershipPurchase = async (req, res, next) => {
  const { invoice } = req.params;
  const userId = req.session.user.id;
  try {
    const purchase = await Purchase.findbyInvoice({ pool, invoice });
    if (!purchase) {
      req.flash('error', 'Purchase not found');
      return res.redirect(`/purchases`);
    }
    if (purchase.operator !== userId) {
      req.flash('error', 'You do not have permission to access this resource');
      return res.redirect(`/purchases`);
    }
    next();
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/purchases`);
  }
};

export const checkOwnershipSales = async (req, res, next) => {
  const { invoice } = req.params;
  const userId = req.session.user.id;
  try {
    const sale = await Sale.findbyInvoice({ pool, invoice });
    if (!sale) {
      req.flash('error', 'Sale not found');
      return res.redirect(`/sales`);
    }
    if (sale.operator !== userId) {
      req.flash('error', 'You do not have permission to access this resource');
      return res.redirect(`/sales`);
    }
    next();
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/sales`);
  }
};