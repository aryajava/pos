export const authLoginValidation = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash("error", "Email or Password is empty");
    return res.redirect("/");
  }
  return next();
}

export const authRegisterValidation = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    req.flash("error", "Email or Password is empty");
    return res.redirect("/register");
  }
  return next();
}
