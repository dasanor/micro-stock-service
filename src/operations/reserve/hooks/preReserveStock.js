const Boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock reserve
 */
function preReserveStock(/* base*/) {
  return (data /* stock, productId, quantity, warehouseId, reserveStockForMinutes */) => {
    return new Promise((resolve, reject) => {
      // Check the warehouse stock existence
      const warehouseStock = data.stock.warehouses.find(w => w.warehouseId === data.warehouseId);
      if (!warehouseStock) {
        reject(Boom.notAcceptable(
           `The warehouse ${data.warehouseId} doesn't have stock for the product ${data.productId}`));
      }
      // Check Stock
      if (warehouseStock.quantityInStock < data.quantity) {
        reject(Boom.notAcceptable(`The warehouse ${data.warehouseId} doesn't have enough stock for the product ${data.productId}`));
      }
      resolve(data);
    });
  };
}

module.exports = preReserveStock;
