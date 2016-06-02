const Boom = require('boom');

/**
 * Hook to allow customization of the unreserve process
 */
function unreserveStock(base) {
  return (data /* reserve, unreserveQuantity */) => {
    return new Promise((resolve, reject) => {
      return base.db.models.Stock
        .update({
          _id: data.reserve.stockId
        }, {
          $inc: {
            quantityInStock: data.unreserveQuantity,
            quantityReserved: -data.unreserveQuantity,
            __v: 1
          }
        })
        .then((dbResult) => {
          if (dbResult.nModified !== 1) {
            return reject(new Boom.preconditionFailed());
          }
          const newStatus = data.reserve.quantity - data.unreserveQuantity === 0 ? 'UNRESERVED' : data.reserve.status;
          return base.db.models.Reserve
            .update({
              _id: data.reserve._id,
              quantity: { $gte: data.unreserveQuantity }
            }, {
              $inc: { quantity: -data.unreserveQuantity },
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
