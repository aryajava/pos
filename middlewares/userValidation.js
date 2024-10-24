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