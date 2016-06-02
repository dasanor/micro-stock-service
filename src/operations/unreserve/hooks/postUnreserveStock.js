const Boom = require('boom');

/**
 * Hook to allow customization of the process after the stock unreserve
 */
function postUnReserveStock(/* base*/) {
  return (data /* reserve, unreserveQuantity */) => {
    return new Promise((resolve /* , reject */) => {
      data.result = {};
      resolve(data);
    });
  };
}

module.exports = postUnReserveStock;
