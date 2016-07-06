const boom = require('boom');

/**
 * Retrieve the stock
 */
function factory(base) {
  return (context, next) => {

    base.db.models.Stock
      .findOne({
        productId: context.productId,
        warehouseId: context.warehouseId
      })
      .exec()
      .then(stock => {
        // Check the stock existence
        if (!stock) {
          return next(boom.notAcceptable(`The product '${context.productId}' doesn't exist in the '${context.warehouseId}' warehouse`));
        }
        context.stock = stock;
        return next();
      });
  };
}

module.exports = factory;
