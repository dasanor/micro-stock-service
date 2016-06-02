const Boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock unreserve
 */
function preUnReserveStock(/* base*/) {
  return (data /* reserve, unreserveQuantity */) => {
    return new Promise((resolve, reject) => {
      if (data.reserve.quantity < data.unreserveQuantity) {
        return reject(Boom.notAcceptable(`The reserve '${data.reserve._id}' doesn't hold enough stock`, { code: 403 }));
      }
      if (data.unreserveQuantity < 1) {
        return reject(Boom.notAcceptable('Incorrect quantity'));
      }
      return resolve(data);
    });
  };
}

module.exports = preUnReserveStock;
