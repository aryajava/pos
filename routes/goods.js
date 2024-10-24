import express from 'express';
import { checkSession } from '../middlewares/checkSession.js';
import Goods from '../models/Goods.js';
import Unit from '../models/Unit.js';
const router = express.Router();

router.get('/', checkSession, async function (req, res, next) {
  const goodsData = await Goods.findAll();
  res.render('goods/listGoods', {
    user: req.session.user,
    title: `POS - Goods`,
    titlePage: `Goods`,
    description: `This is data of Goods`,
    goodsData,
  });
});

router.get('/add', checkSession, async function (req, res, next) {
  res.render('goods/formGoods', {
    user: req.session.user,
    error: req.flash("error"),
    success: req.flash("success"),
    title: `POS - Add Goods`,
    titleForm: `Form Add`,
    titlePage: `Add Goods`,
    description: `This is form to add Goods`,
    goodsData: null,
  });
});

router.post('/add', checkSession, async function (req, res, next) {
  const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = req.body;
  try {
    const newGoods = new Goods(barcode, name, stock, purchaseprice, sellingprice, unit, picture);
    if (await Goods.findByBarcode(barcode)) {
      req.flash("error", "Goods already exists");
      return res.redirect('/goods/add');
    }
    await Goods.save(newGoods);
    res.redirect('/goods');
  } catch (error) {
    console.error("Error add goods:", error);
    req.flash("error", error.message);
    res.status(500).redirect('/goods/add');
  }
});

// API

router.delete('/delete/:barcode', checkSession, async function (req, res, next) {
  const { barcode } = req.params;
  try {
    await Goods.delete(barcode);
    res.json({ message: "Goods deleted" });
  } catch (error) {
    console.error("Error delete goods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/api/goods', checkSession, async function (req, res, next) {
  try {
    const goodsData = await Goods.findAll();
    res.json({ data: goodsData });
  } catch (error) {
    console.error("Error get all goods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;