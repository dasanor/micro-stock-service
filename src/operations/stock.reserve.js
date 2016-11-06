/**
 * ## `stock.reserve` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const defaultwarehouseId = base.config.get('defaultwarehouseId');
  const minutesToReserve = base.config.get('minutesToReserve');

  const reserveChain = new base.utils.Chain().use('reserveChain');

  const op = {
    handler: (msg, reply) => {
      const context = {
        productId: msg.productId,
        quantity: msg.quantity,
        warehouseId: msg.warehouseId || defaultwarehouseId,
        reserveStockForMinutes: msg.reserveStockForMinutes || minutesToReserve
      };
      reserveChain
        .exec(context)
        .then(context => {
          if (context.result && context.result.reserve) {
            if (base.logger.isDebugEnabled()) base.logger.debug(`[stock] reserved  ${context.quantity} product ${context.productId} in warehouse ${context.warehouseId}`);
          }
          return reply(base.utils.genericResponse(context.result));
        })
        // TODO log concurrency errors
        .catch(error => reply(base.utils.genericResponse(null, error)));
    }
  };

  return op;
}

module.exports = opFactory;
