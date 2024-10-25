import bcrypt from 'bcrypt';

export default class Auth {
  constructor(pool, email, password) {
    this.pool = pool;
    this.email = email;
    this.password = password;
  }

  async save(pool) {
    const query = {
      text: `INSERT INTO users (email, password) VALUES($1, $2) RETURNING *`,
      values: [this.email, bcrypt.hashSync(this.password, 10)],
    };
    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Unable to process your request");
    }
  }

  static async findByEmail(pool, email) {
    const query = {
      text: `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      values: [email],
    };
    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Unable to process your request");
    }
  }
}