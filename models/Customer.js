export default class Customer {
  constructor(pool, id, name, address, phone) {
    this.pool = pool;
    this.id = id || null;
    this.name = name;
    this.address = address || null;
    this.phone = phone || null;
  }

  static async findAll(pool, searchQuery = '') {
    let query = `SELECT * FROM customers`;
    try {
      const params = [];
      if (searchQuery) {
        query += ` WHERE name ILIKE $1
                   OR address ILIKE $2`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
      }
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      error.message = "Error findAll Customer: " + error.message;
      throw error;
    }
  }

  static async findById(pool, id) {
    let query = `SELECT * FROM customers WHERE customerid = $1`;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error findById Customer: " + error.message;
      throw error;
    }
  }

  static async save(customerData) {
    const { pool, name, address, phone } = customerData;
    let query = `INSERT INTO customers (name, address, phone) VALUES ($1, $2, $3) RETURNING *`;
    try {
      const result = await pool.query(query, [name, address, phone]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error create Customer: " + error.message;
      throw error;
    }
  }

  static async update(customerData) {
    const { pool, id, name, address, phone } = customerData;
    let query = `UPDATE customers SET name = $1, address = $2, phone = $3 WHERE customerid = $4 RETURNING *`;
    try {
      const result = await pool.query(query, [name, address, phone, id]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error update Customer: " + error.message;
      throw error;
    }
  }

  static async delete(pool, id) {
    let query = `DELETE FROM customers WHERE customerid = $1`;
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error delete Customer: " + error.message;
      throw error;
    }
  }
}