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
          return next(base.utils.Error('stock_not_found'));
        }
        context.stock = stock;
        return next();
      });
  };
}

module.exports = factory;
