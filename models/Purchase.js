import PurchaseItem from "./PurchaseItem.js";

export default class Purchase {
  constructor(pool, supplier, operator) {
    this.pool = pool;
    this.supplier = supplier || null;
    this.operator = operator;
  };

  static async findAll(pool) {
    try {
      const query = `
        SELECT p.*, s.name AS suppliername
        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier = s.supplierid
      `;
      const results = await pool.query(query);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll purchase: " + error.message;
      throw error;
    }
  };

  static async findbyInvoice(invoiceData) {
    const { pool, invoice } = invoiceData;
    try {
      const query = `
        SELECT p.*, s.name AS suppliername, u.name AS operatorname
        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier = s.supplierid
        LEFT JOIN users u ON p.operator = u.userid
        WHERE p.invoice = $1
        LIMIT 1
      `;
      const resultPurchase = await pool.query(query, [invoice]);
      const resultPurchaseItems = await PurchaseItem.findAllByInvoice(pool, invoice);
      return { ...resultPurchase.rows[0], purchaseItems: resultPurchaseItems };
    } catch (error) {
      error.message = "Error findByInvoice purchase: " + error.message;
      throw error;
    }
  };

  static async create(purchaseData) {
    const { pool, operator } = purchaseData;
    try {
      const query = `INSERT INTO purchases (operator) VALUES ($1) RETURNING *`;
      const result = await pool.query(query, [operator]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error create purchase: " + error.message;
      throw error;
    }
  };

  static async update(pool, invoice, purchaseData) {
    const { supplier } = purchaseData;
    try {
      const query = `UPDATE purchases SET supplier = $1 WHERE invoice = $2 RETURNING *`;
      const result = await pool.query(query, [supplier, invoice]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error update purchase: " + error.message;
      throw error;
    }
  };

  static async delete(pool, invoice) {
    try {
      const query = `DELETE FROM purchases WHERE invoice = $1 RETURNING *`;
      await pool.query(query, [invoice]);
    } catch (error) {
      error.message = "Error delete purchase: " + error.message;
      throw error;
    }
  };
}