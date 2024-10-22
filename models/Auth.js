import { pool } from "../config/database.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

export default class Auth {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async save() {
    const query = {
      text: `INSERT INTO ${process.env.DB_TABLE_USER} (email, password) VALUES($1, $2) RETURNING *`,
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

  static async findByEmail(email) {
    const query = {
      text: `SELECT * FROM ${process.env.DB_TABLE_USER} WHERE email = $1 LIMIT 1`,
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