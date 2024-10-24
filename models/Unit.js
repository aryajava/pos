import { pool } from "../config/database.js";
import dotenv from 'dotenv';
dotenv.config();

const tableUnits = process.env.DB_TABLE_UNIT;
if (!tableUnits) {
  throw new Error('DB_TABLE_UNIT is not set in .env file');
}

export default class Unit {
  constructor(unit, name, note) {
    this.unit = unit;
    this.name = name;
    this.note = note;
  }

  static async findAll() {
    try {
      const query = `SELECT * FROM ${tableUnits}`;
      const results = await pool.query(query);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll: " + error.message;
      throw error;
    }
  }

  static async findByUnit(unit) {
    try {
      const query = `SELECT * FROM ${tableUnits} WHERE unit = $1 LIMIT 1`;
      const results = await pool.query(query, [unit]);
      return results.rows[0];
    } catch (error) {
      error.message = "Error findByUnit: " + error.message;
      throw error;
    }
  }

  static async save(newUnit) {
    const { unit, name, note } = newUnit;
    try {
      const query = `INSERT INTO ${tableUnits} (unit, name, note) VALUES ($1, $2, $3) RETURNING *`;
      const results = await pool.query(query, [unit, name, note]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error save: `, error);
      throw error;
    }
  }

  static async update(newUnit, name, note, oldUnit) {
    console.log(newUnit, name, note, oldUnit);
    try {
      const query = `UPDATE ${tableUnits} SET unit = $1, name = $2, note = $3 WHERE unit = $4 RETURNING *`;
      const results = await pool.query(query, [newUnit, name, note, oldUnit]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error update: `, error);
      throw error;
    }
  }

  static async delete(unit) {
    try {
      const query = `DELETE FROM ${tableUnits} WHERE unit = $1 RETURNING *`;
      const results = await pool.query(query, [unit]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error delete: `, error);
      throw error;
    }
  }
}