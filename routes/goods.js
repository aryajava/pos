import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { checkSession } from '../middlewares/checkSession.js';
import Goods from '../models/Goods.js';
const router = express.Router();
const __dirname = import.meta.url.replace('file://', '');

router.get('/', checkSession, async function (req, res, next) {
  // const goodsData = await Goods.findAll();
  // const picture = goodsData && goodsData.picture ? `/asset/goods/${barcode}/${goodsData.picture}` : null;
  res.render('goods/listGoods', {
    user: req.session.user,
    title: `POS - Goods`,
    titlePage: `Goods`,
    description: `This is data of Goods`,
    // goodsData
  });
});

router.get('/add', checkSession, async function (req, res, next) {
  res.render('goods/formGoods', {
    user: req.session.user,
    error: req.flash("error"),
    success: req.flash("success"),
    title: `POS - Add Goods`,
    titleForm: `Form Add`,
    titlePage: `Goods`,
    description: `This is form to add Goods`,
    goodsData: null,
  });
});

router.post('/add', checkSession, async function (req, res, next) {
  const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;
  try {
    // Handle file upload
    let picture = null;
    if (req.files && req.files.picture) {
      const file = req.files.picture;
      const dir = `public/asset/goods/${barcode}`;
      const timestamp = Date.now();
      const filePath = `${dir}/${timestamp}.jpg`;
      fs.mkdirSync(dir, { recursive: true });

      // Resize and convert to jpg
      await sharp(file.data)
        .resize(256, 256)
        .toFormat('jpg')
        .toFile(filePath);

      picture = `${timestamp}.jpg`;
    }

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

router.get('/edit/:barcode', checkSession, async function (req, res, next) {
  const { barcode } = req.params;
  try {
    const goodsData = await Goods.findByBarcode(barcode);
    const picturePath = goodsData && goodsData.picture ? `/asset/goods/${barcode}/${goodsData.picture}` : null;
    if (!goodsData) {
      req.flash("error", "Goods not found");
      return res.redirect('/goods');
    }
    res.render('goods/formGoods', {
      user: req.session.user,
      error: req.flash("error"),
      success: req.flash("success"),
      title: `POS - Edit Goods`,
      titleForm: `Form Edit`,
      titlePage: `Goods`,
      description: `This is form to edit Goods`,
      goodsData,
      picturePath,
    });
  } catch (error) {
    console.error("Error edit goods:", error);
    req.flash("error", error.message);
    res.status(500).redirect('/goods');
  }
});

router.post('/edit/:barcode', checkSession, async function (req, res, next) {
  const { barcode } = req.params;
  const { name, stock, purchaseprice, sellingprice, unit } = req.body;

  try {
    if (!await Goods.findByBarcode(barcode)) {
      req.flash("error", "Goods not found");
      return res.redirect('/goods');
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      req.flash("error", "No files uploaded.");
      res.redirect("/goods/edit/" + barcode);
      return;
    }
    const file = req.files.picture;

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const dir = path.join(__dirname, "../../public/asset/goods/", barcode);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const fileName = `${timestamp}.jpg`;
    const picturePath = `/${dir}/${fileName}`;
    // Resize and convert to jpg
    await sharp(file.data)
      .resize(256, 256)
      .toFormat('jpg')
      .toFile(picturePath);

    const newGoods = new Goods(barcode, name, stock, purchaseprice, sellingprice, unit, fileName);
    await Goods.update(newGoods);
    res.redirect('/goods');
  } catch (error) {
    console.error("Error update goods:", error);
    req.flash("error", error.message);
    res.status(500).redirect('/goods');
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
    const updatedGoodsData = goodsData.map(good => {
      return {
        ...good,
        picture: good.picture ? `/asset/goods/${good.barcode}/${good.picture}` : null
      };
    });
    res.json({ data: updatedGoodsData });
  } catch (error) {
    console.error("Error get all goods:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;