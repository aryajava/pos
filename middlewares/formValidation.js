// Auth

export const authLoginValidation = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash("error", "Email or Password is empty");
    return res.redirect("/");
  }
  if (req.body.password.trim() === "") {
    req.flash("error", "Password is required");
    return res.redirect("/");
  }
  return next();
}

export const authRegisterValidation = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash("error", "Email or Password is empty");
    return res.redirect("/register");
  }
  if (req.body.password.trim() === "") {
    req.flash("error", "Password is required");
    return res.redirect("/register");
  }
  return next();
}

// User

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userFormAddValidation = (req, res, next) => {
  const { email, name, password, role } = req.body;
  if (!email || !name || !password || !role) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/users/add`);
  }
  if (!emailRegex.test(email) || name.trim() === '' || password.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/users/add`);
  }
  return next();
};

export const userFormUpdateValidation = (req, res, next) => {
  const { email, name, role } = req.body;
  const { id } = req.params;
  if (!email || !name || !role) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/users/edit/${id}`);
  }
  if (!emailRegex.test(email) || name.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/users/edit/${id}`);
  }
  return next();
};

// Unit

export const unitFormAddValidation = (req, res, next) => {
  const { unit, name } = req.body;
  if (!unit || !name) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/units/add`);
  }
  if (unit.trim() === '' || name.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/units/add`);
  }
  return next();
}

export const unitFormUpdateValidation = (req, res, next) => {
  const { unit, name } = req.body;
  const { oldUnit } = req.params;
  if (!unit || !name) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/units/edit/${oldUnit}`);
  }
  if (unit.trim() === '' || name.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/units/edit/${oldUnit}`);
  }

  return next();
};

// Goods

export const goodsFormAddValidation = (req, res, next) => {
  const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;
  if (!barcode || !name || !stock || !purchaseprice || !sellingprice || !unit) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/goods/add`);
  }
  if (barcode.trim() === '' || name.trim() === '' || stock.trim() === '' || purchaseprice.trim() === '' || sellingprice.trim() === '' || unit.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/goods/add`);
  }
  return next();
};

export const goodsFormUpdateValidation = (req, res, next) => {
  const { barcode } = req.params;
  const { name, stock, purchaseprice, sellingprice, unit } = req.body;
  if (!barcode || !name || !stock || !purchaseprice || !sellingprice || !unit) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/goods/edit/${barcode}`);
  }
  if (barcode.trim() === '' || name.trim() === '' || stock.trim() === '' || purchaseprice.trim() === '' || sellingprice.trim() === '' || unit.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/goods/edit/${barcode}`);
  }

  return next();
};

// Supplier

export const supplierFormAddValidation = (req, res, next) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/suppliers/add`);
  }
  if (name.trim() === '' || address.trim() === '' || phone.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/suppliers/add`);
  }
  return next();
};

export const supplierFormUpdateValidation = (req, res, next) => {
  const { name, address, phone } = req.body;
  const { id } = req.params;
  if (!name || !address || !phone) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/suppliers/edit/${id}`);
  }
  if (name.trim() === '' || address.trim() === '' || phone.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/suppliers/edit/${id}`);
  }
  return next();
};

// Purchase

export const purchaseFormValidation = (req, res, next) => {
  const { invoice } = req.params;
  const { supplier } = req.body;
  try {
    if (!supplier || supplier.trim() === '') {
      req.flash('error', 'Please fill all fields');
      return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/purchases/edit/${invoice}` });
    }
    return next();
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

// PurchaseItem

export const purchaseItemFormValidation = (req, res, next) => {
  let { invoice, itemcode, quantity, purchaseprice, totalprice } = req.body;
  quantity = parseInt(quantity);
  purchaseprice = parseInt(purchaseprice);
  totalprice = parseInt(totalprice);
  if (!invoice || !itemcode || !quantity || !purchaseprice || !totalprice) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/purchases/edit/${invoice}` });
  }
  if (invoice.trim() === '' || itemcode.trim() === '' || purchaseprice < 1 || quantity < 1 || totalprice < 1) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/purchases/edit/${invoice}` });
  }
  return next();
};

// Customer

export const customerFormAddValidation = (req, res, next) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/customers/add`);
  }
  if (name.trim() === '' || address.trim() === '' || phone.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/customers/add`);
  }
  return next();
};

export const customerFormUpdateValidation = (req, res, next) => {
  const { name, address, phone } = req.body;
  const { id } = req.params;
  if (!name || !address || !phone) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/customers/edit/${id}`);
  }
  if (name.trim() === '' || address.trim() === '' || phone.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/customers/edit/${id}`);
  }
  return next();
};

// Sale

export const saleFormValidation = (req, res, next) => {
  const { invoice } = req.params;
  let { pay, change, customer } = req.body;
  try {
    if (!pay || !customer) {
      req.flash('error', 'Please fill all fields');
      return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/sales/edit/${invoice}` });
    } else if (pay < (pay - change)) {
      req.flash('error', 'Pay must be greater than total summary');
      return res.status(400).json({ success: false, message: 'The payment must be at least equal to the total summary', redirect: `/sales/edit/${invoice}` });
    }
    return next();
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

// SaleItem

export const saleItemFormValidation = (req, res, next) => {
  let { invoice, itemcode, quantity, sellingprice, totalprice } = req.body;
  quantity = parseInt(quantity);
  sellingprice = parseInt(sellingprice);
  totalprice = parseInt(totalprice);
  if (!invoice || !itemcode || !quantity || !sellingprice || !totalprice) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/sales/edit/${invoice}` });
  }
  if (invoice.trim() === '' || itemcode.trim() === '' || sellingprice < 1 || quantity < 1 || totalprice < 1) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).json({ success: false, message: 'Please fill all fields with valid input', redirect: `/sales/edit/${invoice}` });
  }
  return next();
};