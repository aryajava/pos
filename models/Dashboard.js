export default class Dashboard {
  constructor(pool) {
    this.pool = pool;
  }

  static async getMonthlyEarning(pool, searchDate = '') {
    try {
      let query = `SELECT * FROM monthlyearnings`;
      const params = [];
      const { startdate, enddate } = searchDate;
      switch (searchDate) {
        case startdate && !enddate:
          query += ` WHERE date >= $1`;
          params.push(startdate);
          break;
        case enddate && !startdate:
          query += ` WHERE date <= $1`;
          params.push(enddate);
          break;
        case startdate && enddate:
          query += ` WHERE date BETWEEN $1 AND $2`;
          params.push(startdate, enddate);
          break;
        default:
          break;
      };
      console.log(`query: ${query}, params: ${params}`);

      const results = await pool.query(query, params);
      return results.rows;
    } catch (error) {
      error.message = "Error getMonthlyEarning: " + error.message;
      throw error;
    }
  }
  static async getTotalSales(pool, searchDate = '') {
    try {
      let query = `SELECT * FROM sales`;
      const { startdate, enddate } = searchDate;
      const params = [];
      if (startdate || enddate) {
        if (startdate && !enddate) {
          query += ` WHERE time >= $1`;
          params.push(startdate);
        } else if (enddate && !startdate) {
          query += ` WHERE time <= $1`;
          params.push(enddate);
        } else {
          query += ` WHERE time BETWEEN $1 AND $2`;
          params.push(startdate, enddate);
        }
      }
      console.log(`query: ${query}, params: ${params}`);
    } catch (error) {
      error.message = "Error getTotalSales: " + error.message;
      throw error;
    }
  };
};