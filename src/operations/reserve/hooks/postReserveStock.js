const Boom = require('boom');

/**
 * Hook to allow customization of the process after the stock reserve
 */
function postReserveStock(/* base*/) {
  return (data /* stock, quantity, reserveStockForMinutes */) => {
    return new Promise((resolve /* , reject*/) => {
      resolve(data);
    });
  };
}

module.exports = postReserveStock;
