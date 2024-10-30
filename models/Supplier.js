export default class Supplier {
  constructor(pool, name, address, phone) {
    this.pool = pool;
    this.name = name;
    this.address = address;
    this.phone = phone;
  }

  static async findAll(pool, searchQuery = '') {
    try {
      let query = `SELECT * FROM suppliers`;
      const params = [];
      if (searchQuery) {
        query += ` WHERE LOWER(name) LIKE LOWER($1)`;
        params.push(`%${searchQuery}%`);
      }
      const results = await pool.query(query, params);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll: " + error.message;
      throw error;
    }
  }

  static async findById(pool, id) {
    try {
      const query = `SELECT * FROM suppliers WHERE supplierid = $1 LIMIT 1`;
      const results = await pool.query(query, [id]);
      return results.rows[0];
    }
    catch (error) {
      error.message = "Error findById: " + error.message;
      throw error;
    }
  }

  static async save(pool, newSupplier) {
    const { name, address, phone } = newSupplier;
    try {
      const query = `INSERT INTO suppliers (name, address, phone) VALUES ($1, $2, $3) RETURNING *`;
      const results = await pool.query(query, [name, address, phone]);
      return results.rows[0];
    }
    catch (error) {
      error.message = "Error save: " + error.message;
      throw error;
    }
  }

  static async update(pool, newSupplier, id) {
    const { name, address, phone } = newSupplier;
    try {
      const query = `UPDATE suppliers SET name = $1, address = $2, phone = $3 WHERE supplierid = $4 RETURNING *`;
      const results = await pool.query(query, [name, address, phone, id]);
      return results.rows[0];
    }
    catch (error) {
      error.message = "Error update: " + error.message;
      throw error;
    }
  }

  static async delete(pool, id) {
    try {
      const query = `DELETE FROM suppliers WHERE supplierid = $1 RETURNING *`;
      const results = await pool.query(query, [id]);
      return results.rows[0];
    }
    catch (error) {
      error.message = "Error delete: " + error.message;
      throw error;
    }
  }
};