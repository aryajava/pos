export default class Goods {
  constructor(pool, barcode, name, stock, purchaseprice, sellingprice, unit, picture) {
    this.pool = pool;
    this.barcode = barcode;
    this.name = name;
    this.stock = stock;
    this.purchaseprice = purchaseprice;
    this.sellingprice = sellingprice;
    this.unit = unit;
    this.picture = picture || null;
  }

  static async findAll(pool, searchQuery = '') {
    try {
      let query = `
        SELECT g.*, u.name AS unitname
        FROM goods g
        LEFT JOIN units u ON g.unit = u.unit`;
      const params = [];
      if (searchQuery) {
        query += ` WHERE g.name ILIKE $1
                   OR g.barcode ILIKE $2`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`,);
      }
      const results = await pool.query(query, params);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll: " + error.message;
      throw error;
    }
  }

  static async findByBarcode(pool, barcode) {
    try {
      const query = `
        SELECT g.*, u.name AS unitname
        FROM goods g
        LEFT JOIN units u ON g.unit = u.unit
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

  static async save(pool, newGoods) {
    const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = newGoods;
    try {
      const query = `INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const results = await pool.query(query, [barcode, name, stock, purchaseprice, sellingprice, unit, picture]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error save: `, error);
      throw error;
    }
  }

  static async update(pool, newGoods) {
    const { barcode, name, stock, purchaseprice, sellingprice, unit, picture } = newGoods;
    try {
      const query = `UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7 RETURNING *`;
      const results = await pool.query(query, [name, stock, purchaseprice, sellingprice, unit, picture, barcode]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error update: `, error);
      throw error;
    }
  }

  static async delete(pool, barcode) {
    try {
      const query = `DELETE FROM goods WHERE barcode = $1 RETURNING *`;
      const results = await pool.query(query, [barcode]);
      return results.rows[0];
    } catch (error) {
      error.message = "Error delete: " + error.message;
      throw error;
    }
  }
}