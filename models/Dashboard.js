export default class Dashboard {
  constructor(pool) {
    this.pool = pool;
  }

  static async getFinancialSummary(pool, searchDate = '') {
    try {
      const { startdate, enddate } = searchDate;
      const params = [];
      let whereClause = '';
      if (startdate && enddate) {
        whereClause = ` WHERE time::DATE BETWEEN $1 AND $2`;
        params.push(startdate, enddate);
      } else if (startdate) {
        whereClause = ` WHERE time::DATE >= $1`;
        params.push(startdate);
      } else if (enddate) {
        whereClause = ` WHERE time::DATE <= $1`;
        params.push(enddate);
      }
      const query = `
        SELECT 
            (SELECT COALESCE(SUM(totalsum), 0) FROM purchases ${whereClause}) AS purchases,
            (SELECT COALESCE(SUM(totalsum), 0) FROM sales ${whereClause}) AS sales,
            (SELECT COALESCE(SUM(totalsum), 0) FROM sales ${whereClause}) - 
            (SELECT COALESCE(SUM(totalsum), 0) FROM purchases ${whereClause}) AS earnings,
            (SELECT COUNT(*) FROM sales ${whereClause}) AS totalsales;
      `;
      const results = await pool.query(query, params);
      return results.rows[0];
    } catch (error) {
      error.message = "Error getFinancialSummary: " + error.message;
      throw error;
    }
  }


  static async getMonthlyEarning(pool, searchDate = {}) {
    try {
      let query = `
          SELECT
            COALESCE(saa.month, puu.month) as "month",
            COALESCE(puu.expense, 0) as "expense",
            COALESCE(saa.revenue, 0) as "revenue",
            COALESCE(saa.revenue, 0) - COALESCE(puu.expense, 0) as "earning"
          FROM
            (
              SELECT
                SUBSTRING(pu.invoice, 5, 6) AS month,
                SUM(totalsum) AS expense
              FROM
                (
                  SELECT
                    *
                  FROM
                    public.purchases
                  WHERE ($1::date IS NULL OR time::DATE >= $1::date) AND ($2::date IS NULL OR time::DATE <= $2::date)
                ) AS pu
              GROUP BY
                month
            ) AS puu
            FULL OUTER JOIN (
              SELECT
                SUBSTRING(sa.invoice, 9, 6) AS month,
                SUM(totalsum) AS revenue
              FROM
                (
                  SELECT
                    *
                  FROM
                    public.sales
                  WHERE ($1::date IS NULL OR time::DATE >= $1::date) AND ($2::date IS NULL OR time::DATE <= $2::date)
                ) AS sa
              GROUP BY
                month
            ) AS saa ON puu.month = saa.month
          ORDER BY
            "month" ASC;
        `;

      const params = [searchDate.startdate || null, searchDate.enddate || null];
      const results = await pool.query(query, params);
      return results.rows;
    } catch (error) {
      error.message = "Error getMonthlyEarning: " + error.message;
      throw error;
    }
  }


  static async getRevenueSources(pool, searchDate = '') {
    try {
      let query = ` SELECT 
        COUNT(CASE WHEN customer = 1 THEN 1 END) as direct, 
        COUNT(CASE WHEN customer != 1 THEN 1 END) as customer
        FROM sales `;
      const { startdate, enddate } = searchDate;
      const params = [];
      if (startdate || enddate) {
        if (startdate && !enddate) {
          query += ` WHERE time::DATE >= $1`;
          params.push(startdate);
        } else if (enddate && !startdate) {
          query += ` WHERE time::DATE <= $1`;
          params.push(enddate);
        } else {
          query += ` WHERE time::DATE BETWEEN $1 AND $2`;
          params.push(startdate, enddate);
        }
      }
      const results = await pool.query(query, params);
      return results.rows[0];
    } catch (error) {
      error.message = "Error getRevenueSources: " + error.message;
      throw error;
    }
  };
};