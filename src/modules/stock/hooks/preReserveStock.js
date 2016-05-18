const Boom = require('boom');

/*
 Hook to allow customization of the verification process before the stock reserve
 */
function preReserveStock(/* base*/) {
  return (data /* stock, product, warehouseCode, reserveStockForMinutes */) => {
    return new Promise((resolve, reject) => {
      // Check the warehouse stock existence
      const warehouseStock = data.stock.warehouses.find(w => w.warehouseCode === data.warehouseCode);
      if (!warehouseStock) {
        reject(Boom.notAcceptable(
           `The warehouse ${data.warehouseCode} doesn't have stock for the product ${data.product.code}`));
      }
      // Check Stock
      if (warehouseStock.quantityInStock < data.product.quantity) {
        reject(Boom.notAcceptable(`The warehouse ${data.warehouseCode} doesn't have enough stock for the product ${data.product.code}`));
      }
      resolve(data);
    });
  };
}

module.exports = preReserveStock;
