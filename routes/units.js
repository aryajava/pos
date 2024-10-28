import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import { unitFormAddValidation } from '../middlewares/formValidation.js';
import Unit from '../models/Unit.js';
const router = express.Router();

export default (pool) => {
  router.get('/', checkSession, async function (req, res, next) {
    const unitsData = await Unit.findAll(pool);
    res.render('units/listUnit', {
      user: req.session.user,
      title: `POS - Units`,
      titlePage: `Units`,
      description: `This is data of Units`,
      unitsData,
    });
  });

  router.get('/add', checkSession, async function (req, res, next) {
    res.render('units/formUnit', {
      user: req.session.user,
      error: req.flash("error"),
      success: req.flash("success"),
      title: `POS - Units`,
      titlePage: `Units`,
      titleForm: `Form Add`,
      description: `This is form to add new Unit`,
      unitData: null,
    });
  });

  router.post('/add', checkSession, unitFormAddValidation, async function (req, res, next) {
    try {
      const { unit, name, note } = req.body;
      if (await Unit.findByUnit(pool, unit)) {
        req.flash("error", "Unit already exists");
        return res.redirect('/units/add');
      }
      const newUnit = new Unit(pool, unit, name, note);
      await Unit.save(pool, newUnit);
      res.redirect('/units');
    } catch (error) {
      console.error("Error adding unit:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/edit/:unit', checkSession, async function (req, res, next) {
    const { unit } = req.params;
    try {
      const unitData = await Unit.findByUnit(pool, unit);
      if (!unitData) {
        req.flash("error", "Unit not found");
        return res.redirect('/units');
      }
      res.render('units/formUnit', {
        user: req.session.user,
        error: req.flash("error"),
        success: req.flash("success"),
        title: `POS - Units`,
        titlePage: `Units`,
        titleForm: `Form Edit`,
        description: `This is form to edit Unit`,
        unitData,
      });
    } catch (error) {
      console.error("Error fetching unit data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post('/edit/:oldUnit', checkSession, unitFormUpdateValidation, async function (req, res, next) {
    const { oldUnit } = req.params;
    const { unit, name, note } = req.body;
    try {
      await Unit.update(pool, unit, name, note, oldUnit);
      res.redirect('/units');
    } catch (error) {
      console.error("Error updating unit:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // API

  router.delete('/delete/:unit', checkSession, async function (req, res, next) {
    const { unit } = req.params;
    try {
      await Unit.delete(pool, unit);
      res.status(200).json({ message: "Unit deleted successfully" });
    } catch (error) {
      console.error("Error deleting unit:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/api/units', checkSession, async function (req, res, next) {
    try {
      const searchQuery = req.query.q || '';
      const unitsData = await Unit.findAll(pool, searchQuery);
      res.json({ data: unitsData });
    } catch (error) {
      console.error("Error fetching users data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
};
