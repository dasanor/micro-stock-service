const Boom = require('boom');

/**
 * Hook to allow customization of the unreserve process
 */
function unreserveStock(base) {
  return (data /* reserve, quantity */) => {
    return new Promise((resolve, reject) => {
      return base.db.models.Stock
        .update({
          _id: data.reserve.stockId
        }, {
          $inc: {
            quantityInStock: data.quantity,
            quantityReserved: -data.quantity,
            __v: 1
          }
        })
        .then((dbResult) => {
          if (dbResult.nModified !== 1) {
            return reject(new Boom.preconditionFailed());
          }
          const newStatus = data.reserve.quantity - data.quantity === 0 ? 'UNRESERVED' : data.reserve.status;
          return base.db.models.Reserve
            .update({
              _id: data.reserve._id,
              quantity: { $gte: data.quantity }
            }, {
              $inc: { quantity: -data.quantity },
              status: newStatus
            });
        })
        .then((result /* result */) => {
          return resolve(data);
        })
        .catch(error => reject(error));
    });
  };
}

module.exports = unreserveStock;
