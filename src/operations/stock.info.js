/**
 * ## `stock.info` operation factory
 *
 * Get Stock operation
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  const op = {
    // TODO: create the product JsonSchema
    handler: ({ productId, warehouseId }, reply) => {
      return base.db.models.Stock
        .findOne({ productId, warehouseId })
        .exec()
        .then(stock => {
          if (!stock) throw base.utils.Error('stock_not_found');
          return reply(base.utils.genericResponse({ stock: stock.toClient() }));
        })
        .catch(error => reply(base.utils.genericResponse(null, error)));
    }
  };
  return op;
}

// Exports the factory
module.exports = opFactory;
