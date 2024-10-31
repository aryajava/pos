export default class SaleItem {
  constructor(pool, invoice, itemcode, quantity, sellingprice, totalprice) {
    this.pool = pool;
    this.invoice = invoice;
    this.itemcode = itemcode;
    this.quantity = quantity;
    this.sellingprice = sellingprice;
    this.totalprice = totalprice;
  };

  static async findAllByInvoice(pool, invoice) {
    try {
      const query = `
        SELECT si.*, g.name AS itemname
        FROM saleitems si
        LEFT JOIN goods g ON si.itemcode = g.barcode
        WHERE si.invoice = $1
      `;
      const results = await pool.query(query, [invoice]);
      return results.rows;
    } catch (error) {
      error.message = "Error findAllByInvoice: " + error.message;
      throw error;
    }
  };

  static async addItem(pool, itemData) {
    let { invoice, itemcode, quantity, sellingprice, totalprice } = itemData;
    quantity = parseInt(quantity);
    sellingprice = parseFloat(sellingprice);
    totalprice = parseFloat(totalprice);
    try {
      const checkQuery = `
        SELECT * FROM saleitems
        WHERE invoice = $1 AND itemcode = $2
      `;
      const checkResult = await pool.query(checkQuery, [invoice, itemcode]);

      if (checkResult.rows.length > 0) {
        const existingItem = checkResult.rows[0];
        const newQuantity = existingItem.quantity + quantity;
        const newTotalPrice = parseFloat(newQuantity) * sellingprice;
        const updateQuery = `
          UPDATE saleitems
          SET quantity = $1, totalprice = $2
          WHERE invoice = $3 AND itemcode = $4
          RETURNING *
        `;
        const updateResult = await pool.query(updateQuery, [newQuantity, newTotalPrice, invoice, itemcode]);
        return updateResult.rows[0];
      } else {
        const insertQuery = `
          INSERT INTO saleitems (invoice, itemcode, quantity, sellingprice, totalprice)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [invoice, itemcode, quantity, sellingprice, totalprice]);
        return insertResult.rows[0];
      }
    } catch (error) {
      error.message = "Error addItem: " + error.message;
      throw error;
    }
  };

  static async deleteItem(pool, invoice, itemcode) {
    try {
      const query = `
        DELETE FROM saleitems
        WHERE invoice = $1 AND itemcode = $2
        RETURNING *
      `;
      const result = await pool.query(query, [invoice, itemcode]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error deleteItem: " + error.message;
      throw error;
    }
  };
};