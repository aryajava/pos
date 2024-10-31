import SaleItem from "./SaleItem.js";

export default class Sale {
  constructor(pool, customer, operator) {
    this.pool = pool;
    this.customer = customer || null;
    this.operator = operator;
  };

  static async findAll(pool) {
    try {
      const query = `
        SELECT s.*, c.name AS customername
        FROM sales s
        LEFT JOIN customers c ON s.customer = c.customerid
      `;
      const results = await pool.query(query);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll sale: " + error.message;
      throw error;
    }
  };

  static async findbyInvoice(invoiceData) {
    const { pool, invoice } = invoiceData;
    try {
      const query = `
        SELECT s.*, c.name AS customername, u.name AS operatorname
        FROM sales s
        LEFT JOIN customers c ON s.customer = c.customerid
        LEFT JOIN users u ON s.operator = u.userid
        WHERE s.invoice = $1
        LIMIT 1
      `;
      const resultSale = await pool.query(query, [invoice]);
      const resultSaleItems = await SaleItem.findAllByInvoice(pool, invoice);
      return { ...resultSale.rows[0], saleItems: resultSaleItems };
    } catch (error) {
      error.message = "Error findByInvoice sale: " + error.message;
      throw error;
    }
  };

  static async create(saleData) {
    const { pool, operator } = saleData;
    try {
      const query = `INSERT INTO sales (operator) VALUES ($1) RETURNING *`;
      const result = await pool.query(query, [operator]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error create sale: " + error.message;
      throw error;
    }
  };

  static async update(pool, invoice, saleData) {
    const { pay, change, customer } = saleData;
    try {
      const query = `UPDATE sales SET pay = $1, change = $2, customer = $3 WHERE invoice = $4 RETURNING *`;
      const result = await pool.query(query, [pay, change, customer, invoice]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error update sale: " + error.message;
      throw error;
    }
  };

  static async delete(pool, invoice) {
    try {
      const query = `DELETE FROM sales WHERE invoice = $1 RETURNING *`;
      const result = await pool.query(query, [invoice]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error delete sale: " + error.message;
      throw error;
    }
  };
};