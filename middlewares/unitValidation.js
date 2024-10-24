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