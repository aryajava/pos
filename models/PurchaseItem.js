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
    const { invoice, itemcode, quantity, purchaseprice, totalprice } = itemData;
    try {
      const query = `
        INSERT INTO purchaseitems (invoice, itemcode, quantity, purchaseprice, totalprice)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await pool.query(query, [invoice, itemcode, quantity, purchaseprice, totalprice]);
      return result.rows[0];
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