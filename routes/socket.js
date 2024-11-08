import { pool } from "../app.js";
import Goods from "../models/Goods.js";

export const emitStockAlertToAdmins = async (io) => {
  const checkLowStockGoods = await Goods.findAll(pool);
  await Promise.all(checkLowStockGoods.map(async (item) => {
    if (item.stock <= 5) {
      io.sockets.sockets.forEach((socket) => {
        if (socket.userRole === 'admin') {
          socket.emit('stockAlert', {
            barcode: item.barcode,
            stock: item.stock,
            name: item.name,
          });
        }
      });
    }
  }));
};

export const emitRemoveStockAlertToAdmins = (io, item) => {
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
      const checkLowStockGoods = await Goods.findAll(pool);
      await Promise.allSettled(checkLowStockGoods.map(async (item) => {
        if (item.stock <= 5) {
          try {
            socket.emit('stockAlert', {
              barcode: item.barcode,
              stock: item.stock,
              name: item.name,
            });
          } catch (error) {
            console.error(`Failed to get stock alert for item ${item.barcode}`, error);
          }
        }
      }));
    } else {
      return;
    }
  } catch (error) {
    console.error('Error checking stock:', error);
  }
};
