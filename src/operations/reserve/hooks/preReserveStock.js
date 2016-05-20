const Boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock reserve
 */
function preReserveStock(/* base*/) {
  return (data /* stock, quantity, reserveStockForMinutes */) => {
    return new Promise((resolve, reject) => {
      // Check Stock
      if (data.stock.quantityInStock < data.quantity) {
        reject(Boom.notAcceptable(`The warehouse ${data.stock.warehouseId} doesn't have enough stock for the product ${data.stock.productId}`));
      }
      resolve(data);
    });
  };
}

module.exports = preReserveStock;
