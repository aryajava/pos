export default class PurchaseItem {
  constructor(pool, invoice, itemcode, quantity, purchaseprice, totalprice) {
    this.pool = pool;
    this.invoice = invoice;
    this.itemcode = itemcode;
    this.quantity = quantity;
    this.purchaseprice = purchaseprice;
    this.totalprice = totalprice;
  };

  static async findAllByInvoice(pool, invoice) {
    try {
      const query = `
        SELECT pi.*, g.name AS itemname
        FROM purchaseitems pi
        LEFT JOIN goods g ON pi.itemcode = g.barcode
        WHERE pi.invoice = $1
      `;
      const results = await pool.query(query, [invoice]);
      return results.rows;
    } catch (error) {
      error.message = "Error findAllByInvoice: " + error.message;
      throw error;
    }
  };

  static async addItem(pool, itemData) {
    let { invoice, itemcode, quantity, purchaseprice, totalprice } = itemData;
    quantity = parseInt(quantity);
    purchaseprice = parseFloat(purchaseprice);
    totalprice = parseFloat(totalprice);
    try {
      const checkQuery = `
        SELECT * FROM purchaseitems
        WHERE invoice = $1 AND itemcode = $2
      `;
      const checkResult = await pool.query(checkQuery, [invoice, itemcode]);

      if (checkResult.rows.length > 0) {
        const existingItem = checkResult.rows[0];
        const newQuantity = existingItem.quantity + quantity;
        const newTotalPrice = parseFloat(newQuantity) * purchaseprice;
        const updateQuery = `
          UPDATE purchaseitems
          SET quantity = $1, totalprice = $2
          WHERE invoice = $3 AND itemcode = $4
          RETURNING *
        `;
        const updateResult = await pool.query(updateQuery, [newQuantity, newTotalPrice, invoice, itemcode]);
        return updateResult.rows[0];
      } else {
        const insertQuery = `
          INSERT INTO purchaseitems (invoice, itemcode, quantity, purchaseprice, totalprice)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [invoice, itemcode, quantity, purchaseprice, totalprice]);
        return insertResult.rows[0];
      }
    } catch (error) {
      error.message = "Error addItem: " + error.message;
      console.error(error.message);
      throw error;
    }
  };

  static async deleteItem(pool, id) {
    try {
      const query = `DELETE FROM purchaseitems WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      error.message = "Error deleteItem: " + error.message;
      console.error(error.message);
      throw error;
    }
  }

};