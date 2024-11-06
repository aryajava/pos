import { pool } from "../app.js";
import Goods from "../models/Goods.js";

export const checkStock = async (socket) => {
  try {
    const lowStockGoods = await Goods.checkStockLow(pool);
    lowStockGoods.forEach((item) => {
      socket.emit('stockAlert', {
        name: item.name,
        stock: item.stock,
        barcode: item.barcode,
      });
    });
  } catch (error) {
    console.error('Error checking stock:', error);
  }
};
