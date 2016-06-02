const boom = require('boom');

/**
 * ## `get` operation factory
 *
 * Get Stock operation
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  /**
   * ## catalog.get service
   *
   * Gets a Stock
   */
  const op = {
    name: 'get',
    path: '/{productId}/warehouse/{warehouseId}',
    method: 'GET',
    // TODO: create the product JsonSchema
    handler: ({ productId, warehouseId }, reply) => {
      return base.db.models.Stock
        .findOne({ productId, warehouseId })
        .exec()
        .then(stock => {
          if (!stock) throw (boom.notFound('Stock not found'));
          return reply(stock.toClient());
        })
        .catch(error => {
          if (!(error.isBoom || error.statusCode == 404)) base.logger.error(error);
          reply(boom.wrap(error));
        });
    }
  };
  return op;
}

// Exports the factory
module.exports = opFactory;
