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
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    if (purchase.operator !== userId) {
      return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOwnershipSales = async (req, res, next) => {
  const { invoice } = req.params;
  const userId = req.session.user.id;
  try {
    const sale = await Sale.findbyInvoice({ pool, invoice });
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    if (sale.operator !== userId) {
      return res.status(403).json({ success: false, message: 'You do not have permission to access this resource' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};