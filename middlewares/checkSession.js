export const checkSessionAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  return next();
};

export const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  return next();
}