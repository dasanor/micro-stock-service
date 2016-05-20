const Boom = require('boom');

/**
 * ## `set` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory( base ) {
  /**
   * ## stock.set service
   *
   * Creates a new stock or modifies an existent one
   */
  const op = {
    name: 'set',
    handler: ( {productId, warehouseId, quantityInStock, quantityReserved}, reply ) => {
      base.db.models.Stock
        .findOne({ productId, warehouseId })
        .exec()
        .then(stock => {
          const stockToSave = stock ||
            new base.db.models.Stock({
              productId,
              warehouseId
            });
          stockToSave.quantityInStock = quantityInStock;
          if (quantityReserved !== undefined) stockToSave.quantityReserved = quantityReserved;
          return stockToSave.save();
        })
        .then(savedStock => {
          if (base.logger.isDebugEnabled) base.logger.debug(`[stock] stock set for product ${savedStock.productId}`);
          return reply(savedStock.toClient());
        })
        .catch(error => {
          base.logger.error(error);
          reply(Boom.wrap(error));
        });
    }
  };

  return op;
}

module.exports = opFactory;
