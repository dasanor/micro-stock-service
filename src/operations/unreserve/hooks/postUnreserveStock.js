const Boom = require('boom');

/**
 * Hook to allow customization of the process after the stock unreserve
 */
function postUnReserveStock(/* base*/) {
  return (data /* reserve, quantity */) => {
    return new Promise((resolve /* , reject */) => {
      resolve(data);
    });
  };
}

module.exports = postUnReserveStock;
