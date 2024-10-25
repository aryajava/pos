import { pool } from "../config/database.js";
import dotenv from 'dotenv';
dotenv.config();

const tableGoods = process.env.DB_TABLE_GOODS;
const tableUnit = process.env.DB_TABLE_UNIT;
if (!tableGoods) {
  throw new Error('DB_TABLE_GOODS is not set in .env file');
}
if (!tableUnit) {
  throw new Error('DB_TABLE_UNIT is not set in .env file');
}

export default class Goods {
  constructor(barcode, name, stock, purchaseprice, sellingprice, unit, picture) {
    this.barcode = barcode;
    this.name = name;
    this.stock = stock;
    this.purchaseprice = purchaseprice;
    this.sellingprice = sellingprice;
    this.unit = unit;
    this.picture = picture || null;
  }

  static async findAll() {
    try {
      const query = `
        SELECT g.*, u.name AS unitname
        FROM ${tableGoods} g
        LEFT JOIN ${tableUnit} u ON g.unit = u.unit
      `;
      const results = await pool.query(query);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll: " + error.message;
      throw error;
    }
  }

  static async findByBarcode(barcode) {
    try {
      const query = `
        SELECT g.*, u.name AS unitname
        FROM ${tableGoods} g
        LEFT JOIN ${tableUnit} u ON g.unit = u.unit
        WHERE g.barcode = $1
        LIMIT 1
      `;
      const results = await pool.query(query, [barcode]);
      return results.rows[0];
    } catch (error) {
      error.message = "Error findByBarcode: " + error.message;
      throw error;
    }
  }

  static async save(newGoods) {
    const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = newGoods;
    try {
      const query = `INSERT INTO ${tableGoods} (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const results = await pool.query(query, [barcode, name, stock, purchaseprice, sellingprice, unit, picture]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error save: `, error);
      throw error;
    }
  }

  static async update(newGoods) {
    const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = newGoods;
    try {
      const query = `UPDATE ${tableGoods} SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7 RETURNING *`;
      const results = await pool.query(query, [name, stock, purchaseprice, sellingprice, unit, picture, barcode]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error update: `, error);
      throw error;
    }
  }

  static async delete(barcode) {
    try {
      const query = `DELETE FROM ${tableGoods} WHERE barcode = $1 RETURNING *`;
      const results = await pool.query(query, [barcode]);
      return results.rows[0];
    } catch (error) {
      error.message = "Error delete: " + error.message;
      throw error;
    }
  }
}