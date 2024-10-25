export default class Unit {
  constructor(pool, unit, name, note) {
    this.pool = pool;
    this.unit = unit;
    this.name = name;
    this.note = note;
  }

  static async findAll(pool, searchQuery = '') {
    try {
      let query = `SELECT * FROM units`;
      const params = [];
      if (searchQuery) {
        query += ` WHERE LOWER(name) LIKE LOWER($1) 
                 OR LOWER(unit) LIKE LOWER($2) 
                 OR LOWER(note) LIKE LOWER($3)`;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
      }
      const results = await pool.query(query, params);
      return results.rows;
    } catch (error) {
      error.message = "Error findAll: " + error.message;
      throw error;
    }
  }

  static async findByUnit(pool, unit) {
    try {
      const query = `SELECT * FROM units WHERE unit = $1 LIMIT 1`;
      const results = await pool.query(query, [unit]);
      return results.rows[0];
    } catch (error) {
      error.message = "Error findByUnit: " + error.message;
      throw error;
    }
  }

  static async save(pool, newUnit) {
    const { unit, name, note } = newUnit;
    try {
      const query = `INSERT INTO units (unit, name, note) VALUES ($1, $2, $3) RETURNING *`;
      const results = await pool.query(query, [unit, name, note]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error save: `, error);
      throw error;
    }
  }

  static async update(pool, newUnit, name, note, oldUnit) {
    console.log(newUnit, name, note, oldUnit);
    try {
      const query = `UPDATE units SET unit = $1, name = $2, note = $3 WHERE unit = $4 RETURNING *`;
      const results = await pool.query(query, [newUnit, name, note, oldUnit]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error update: `, error);
      throw error;
    }
  }

  static async delete(pool, unit) {
    try {
      const query = `DELETE FROM units WHERE unit = $1 RETURNING *`;
      const results = await pool.query(query, [unit]);
      return results.rows[0];
    } catch (error) {
      console.error(`Error delete: `, error);
      throw error;
    }
  }
}