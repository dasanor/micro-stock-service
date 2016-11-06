/**
 * ## `stock.update` operation factory
 *
 * Update Stock operation
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  const op = {
    // TODO: create the product JsonSchema
    handler: ({ productId, warehouseId, quantityInStock, quantityReserved }, reply) => {
      const update = {};
      if (quantityInStock) update.quantityInStock = quantityInStock;
      if (quantityReserved) update.quantityReserved = quantityReserved;

      return base.db.models.Stock
        .findOneAndUpdate({ productId, warehouseId }, { $set: update }, { new: true })
        .exec()
        .then(savedStock => {
          if (!savedStock) throw base.utils.Error('stock_not_found');
          if (base.logger.isDebugEnabled()) base.logger.debug(`[stock] stock updated for product '${savedStock.productId}' and warehose '${savedStock.warehouseId}'`);
          return reply(base.utils.genericResponse({ stock: savedStock.toClient() }));
        })
        .catch(error => reply(base.utils.genericResponse(null, error)));
    }
  };
  return op;
}

// Exports the factory
module.exports = opFactory;
