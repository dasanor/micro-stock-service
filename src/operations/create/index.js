/**
 * ## `stock.create` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  const op = {
    name: 'stock.create',
    // TODO: create the stock JsonSchema
    handler: ({ productId, warehouseId, quantityInStock, quantityReserved }, reply) => {
      const stockToSave = new base.db.models.Stock({
        productId,
        warehouseId,
        quantityInStock,
        quantityReserved: quantityReserved || 0
      });
      stockToSave.save()
        .then(savedStock => {
          if (base.logger.isDebugEnabled()) {
            base.logger.debug(`[stock] stock set for product ${savedStock.productId}`);
          }
          return reply(base.utils.genericResponse({ stock: savedStock.toClient() }));
        })
        .catch(error => reply(base.utils.genericResponse(null, error)));
    }
  };

  return op;
}

module.exports = opFactory;
