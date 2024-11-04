import bcrypt from 'bcrypt';

export default class User {
  constructor(pool, email, name, password, role) {
    this.pool = pool;
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  static async findAll(pool) {
    try {
      const query = `SELECT * FROM users`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findById(pool, id) {
    try {
      const query = `SELECT * FROM users WHERE userid = $1 LIMIT 1`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findByEmail(pool, email) {
    try {
      const query = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async save(pool, newUserData) {
    const { email, name, password, role } = newUserData;
    try {
      const query = `INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await pool.query(query, [email, name, hashedPassword, role]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(pool, userData, id) {
    const { email, name, role } = userData;
    try {
      const query = `UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4 RETURNING *`;
      const result = await pool.query(query, [email, name, role, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateProfile(pool, userData) {
    const { id, email, name } = userData;
    try {
      const query = `UPDATE users SET email = $1, name = $2 WHERE userid = $3 RETURNING *`;
      const result = await pool.query(query, [email, name, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  };

  static async updatePassword(pool, userData) {
    const { id, newpassword } = userData;
    try {
      const query = `UPDATE users SET password = $1 WHERE userid = $2 RETURNING *`;
      const hashedPassword = bcrypt.hashSync(newpassword, 10);
      const result = await pool.query(query, [hashedPassword, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(pool, id) {
    try {
      const query = `DELETE FROM users WHERE userid = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}