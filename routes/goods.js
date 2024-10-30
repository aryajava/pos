import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { checkSession } from '../middlewares/checkSession.js';
import { goodsFormAddValidation, goodsFormUpdateValidation } from '../middlewares/formValidation.js';
import Goods from '../models/Goods.js';
const router = express.Router();
const __dirname = import.meta.url.replace('file://', '');

export default (pool) => {
  router.get('/', checkSession, async (req, res, next) => {
    res.render('goods/listGoods', {
      user: req.session.user,
      title: `POS - Goods`,
      titlePage: `Goods`,
      description: `This is data of Goods`,
    });
  });

  router.get('/add', checkSession, async (req, res, next) => {
    res.render('goods/formGoods', {
      user: req.session.user,
      title: `POS - Add Goods`,
      titleForm: `Form Add`,
      titlePage: `Goods`,
      description: `This is form to add Goods`,
      goodsData: null,
    });
  });

  router.post('/add', checkSession, goodsFormAddValidation, async (req, res, next) => {
    const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body;
    try {
      let picture = null;
      if (req.files && req.files.picture) {
        const file = req.files.picture;
        const dir = `public/asset/goods/${barcode}`;
        const timestamp = Date.now();
        const filePath = `${dir}/${timestamp}.jpg`;
        fs.mkdirSync(dir, { recursive: true });
        await sharp(file.data)
          .resize(256, 256)
          .toFormat('jpg')
          .toFile(filePath);

        picture = `${timestamp}.jpg`;
      }
      const newGoods = new Goods(pool, barcode, name, stock, purchaseprice, sellingprice, unit, picture);
      if (await Goods.findByBarcode(pool, barcode)) {
        req.flash("error", "Goods already exists");
        return res.redirect('/goods/add');
      }
      await Goods.save(pool, newGoods);
      res.redirect('/goods');
    } catch (error) {
      console.error("Error add goods:", error);
      req.flash("error", error.message);
      res.status(500).redirect('/goods/add');
    }
  });

  router.get('/edit/:barcode', checkSession, async (req, res, next) => {
    const { barcode } = req.params;
    try {
      const goodsData = await Goods.findByBarcode(pool, barcode);
      const picturePath = goodsData && goodsData.picture ? `/asset/goods/${barcode}/${goodsData.picture}` : null;
      if (!goodsData) {
        req.flash("error", "Goods not found");
        return res.redirect('/goods');
      }
      res.render('goods/formGoods', {
        user: req.session.user,
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

  router.post('/edit/:barcode', checkSession, goodsFormUpdateValidation, async (req, res, next) => {
    const { barcode } = req.params;
    const { name, stock, purchaseprice, sellingprice, unit } = req.body;
    try {
      if (!await Goods.findByBarcode(pool, barcode)) {
        req.flash("error", "Goods not found");
        return res.redirect('/goods');
      }
      if (req.files && req.files.picture) {
        const file = req.files.picture;
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
        const dir = path.join(__dirname, "../../public/asset/goods/", barcode);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const fileName = `${timestamp}.jpg`;
        const picturePath = `/${dir}/${fileName}`;
        await sharp(file.data)
          .resize(256, 256)
          .toFormat('jpg')
          .toFile(picturePath);
        const newGoods = new Goods(pool, barcode, name, stock, purchaseprice, sellingprice, unit, fileName);
        await Goods.update(pool, newGoods);
      } else {
        const goodsData = await Goods.findByBarcode(pool, barcode);
        const newGoods = new Goods(pool, barcode, name, stock, purchaseprice, sellingprice, unit, goodsData.picture);
        await Goods.update(pool, newGoods);
      }
      res.redirect('/goods');
    } catch (error) {
      console.error("Error update goods:", error);
      req.flash("error", error.message);
      res.status(500).redirect('/goods');
    }
  });

  // API

  router.delete('/delete/:barcode', checkSession, async (req, res, next) => {
    const { barcode } = req.params;
    try {
      await Goods.delete(pool, barcode);
      const dir = path.join(__dirname, "../../public/asset/goods/", barcode);
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
      }
      res.json({ message: "Goods deleted" });
    } catch (error) {
      console.error("Error delete goods:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get('/api/goods', checkSession, async (req, res, next) => {
    const searchQuery = req.query.q || '';
    try {
      const goodsData = await Goods.findAll(pool, searchQuery);
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

  router.get('/api/goods/:barcode', checkSession, async (req, res, next) => {
    const { barcode } = req.params;
    try {
      const goodsData = await Goods.findByBarcode(pool, barcode);
      res.json({ data: goodsData });
    } catch (error) {
      console.error("Error get goods:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}