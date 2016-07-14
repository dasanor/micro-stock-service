const boom = require('boom');

/**
 * ## `update` operation factory
 *
 * Update Stock operation
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  /**
   * ## catalog.update service
   *
   * Updates a Stock
   */
  const op = {
    name: 'update',
    path: '/{productId}/warehouse/{warehouseId}',
    method: 'PUT',
    // TODO: create the product JsonSchema
    handler: ({ productId, warehouseId, quantityInStock, quantityReserved }, reply) => {
      const update = {};
      if (quantityInStock) update.quantityInStock = quantityInStock;
      if (quantityReserved) update.quantityReserved = quantityReserved;

      return base.db.models.Stock
        .findOneAndUpdate({ productId, warehouseId }, { $set: update }, { new: true })
        .exec()
        .then(savedStock => {
          if (!savedStock) throw (boom.notFound('Stock not found'));
          if (base.logger.isDebugEnabled()) base.logger.debug(`[stock] stock updated for product '${savedStock.productId}' and warehose '${savedStock.warehouseId}'`);
          return reply(savedStock.toClient());
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
