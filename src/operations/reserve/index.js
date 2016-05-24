const Boom = require('boom');

/**
 * ## `reserve` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const defaultwarehouseId = base.config.get('defaultwarehouseId');
  const preReserveStock = base.services.loadModule('hooks:preReserveStock:handler');
  const reserveStock = base.services.loadModule('hooks:reserveStock:handler');
  const postReserveStock = base.services.loadModule('hooks:postReserveStock:handler');

  const op = {
    name: 'reserve',
    handler: ({ productId, quantity, warehouseId = defaultwarehouseId, reserveStockForMinutes }, reply) => {

      base.db.models.Stock
        .findOne({ productId, warehouseId })
        .exec()
        .then(stock => {
          // Check the product existence
          if (!stock) {
            throw (Boom.notAcceptable(`The product '${productId}' doesn't exist`));
          }
          return { stock, quantity, reserveStockForMinutes };
        })
        .then(data => preReserveStock(data))
        .then(data => reserveStock(data))
        .then(data => postReserveStock(data))
        .then(data => {
          if (data.result.code === 301) {
            if (base.logger.isDebugEnabled) base.logger.debug(`[stock] ${data.quantity} stock reserved for product ${data.productId} in warehouse ${data.warehouseId}`);
          }
          return reply(data.result);
        })
        .catch(error => {
          if (error.isBoom) {
            if (error.output.statusCode === 412) {
              base.logger.warn('[stock] Concurrency error');
            }
            return reply(error);
          }
          base.logger.error(error);
          return reply(Boom.wrap(error));
        });
    }
  };

  return op;
}

module.exports = opFactory;
