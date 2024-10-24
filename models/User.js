import { pool } from "../config/database.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const tableUsers = process.env.DB_TABLE_USER;
if (!tableUsers) {
  throw new Error('DB_TABLE_USER is not set in .env file');
}

export default class User {
  constructor(email, name, password, role) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  static async findAll() {
    try {
      const query = `SELECT * FROM users`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findById(id) {
    try {
      const query = `SELECT * FROM ${tableUsers} WHERE userid = $1 LIMIT 1`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async findByEmail(email) {
    try {
      const query = `SELECT * FROM ${tableUsers} WHERE email = $1 LIMIT 1`;
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async save(email, name, password, role) {
    try {
      const query = `INSERT INTO ${tableUsers} (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await pool.query(query, [email, name, hashedPassword, role]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(email, name, role, id) {
    try {
      const query = `UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4 RETURNING *`;
      const result = await pool.query(query, [email, name, role, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM users WHERE userid = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  }
}