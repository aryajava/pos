import { pool } from "../config/database.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();


export default class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async save() {
    const query = {
      text: 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
      values: [this.email, await bcrypt.hash(this.password, 10)],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      return error;
    }
  }

  static async findByEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1 LIMIT 1',
      values: [email],
    };

    try {
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      return error;
    }
  }
}