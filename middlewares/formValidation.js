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
  const { id } = req.params;
  if (!unit || !name) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/units/edit/${id}`);
  }
  if (unit.trim() === '' || name.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/units/edit/${id}`);
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
  const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;
  const { id } = req.params;
  if (!barcode || !name || !stock || !purchaseprice || !sellingprice || !unit) {
    req.flash('error', 'Please fill all fields');
    return res.status(400).redirect(`/goods/edit/${id}`);
  }
  if (barcode.trim() === '' || name.trim() === '' || stock.trim() === '' || purchaseprice.trim() === '' || sellingprice.trim() === '' || unit.trim() === '') {
    req.flash('error', 'Please fill all fields with valid input');
    return res.status(400).redirect(`/goods/edit/${id}`);
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