import { pool } from "../app.js";
import Goods from "../models/Goods.js";

export const emitStockAlertToAdmins = async (io) => {
  const lowStockGoods = await Goods.checkStockLow(pool);
  lowStockGoods.forEach((item) => {
    // Emit hanya kepada socket dengan userRole 'admin'
    io.sockets.sockets.forEach((socket) => {
      if (socket.userRole === 'admin') {
        socket.emit('stockAlert', {
          barcode: item.barcode,
          stock: item.stock,
          name: item.name,
        });
      }
    });
  });
};

export const emitRemoveStockAlertToAdmins = (io, item) => {
  console.log(`Remove stock alert for ${item.name}`);

  io.sockets.sockets.forEach((socket) => {
    if (socket.userRole === 'admin') {
      socket.emit('removeStockAlert', {
        barcode: item.barcode,
        name: item.name,
      });
    }
  });
};

export const checkStock = async (socket) => {
  try {
    const userRole = socket.request.session.user.role;
    if (userRole === 'admin') {
      const lowStockGoods = await Goods.checkStockLow(pool);
      lowStockGoods.forEach((item) => {
        socket.emit('stockAlert', {
          name: item.name,
          stock: item.stock,
          barcode: item.barcode,
        });
      });
    } else {
      return;
    }
  } catch (error) {
    console.error('Error checking stock:', error);
  }
};
