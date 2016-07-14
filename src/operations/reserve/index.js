const boom = require('boom');

/**
 * ## `reserve` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const defaultwarehouseId = base.config.get('defaultwarehouseId');

  const reserveChain = new base.utils.Chain().use('reserveChain');

  const op = {
    name: 'reserve',
    path: '/reserve',
    method: 'POST',
    handler: (msg, reply) => {
      const context = {
        productId: msg.productId,
        quantity: msg.quantity,
        warehouseId: msg.warehouseId || defaultwarehouseId,
        reserveStockForMinutes: msg.reserveStockForMinutes
      };
      reserveChain
        .exec(context)
        .then(context => {
          if (context.result.code === 301) {
            if (base.logger.isDebugEnabled()) base.logger.debug(`[stock] ${context.quantity} stock reserved for product ${context.productId} in warehouse ${context.warehouseId}`);
          }
          return reply(context.result).code(201);
        })
        .catch(error => {
          if (error.isBoom) {
            if (error.output.statusCode === 412) {
              base.logger.warn('[stock] Concurrency error');
            }
            return reply(error);
          }
          base.logger.error(error);
          return reply(boom.wrap(error));
        });
    }
  };

  return op;
}

module.exports = opFactory;
