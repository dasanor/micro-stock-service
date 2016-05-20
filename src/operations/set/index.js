const Boom = require('boom');

/**
 * ## `set` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  /**
   * ## stock.set service
   *
   * Creates a new stock or modifies an existent one
   */
  const op = {
    name: 'set',
    handler: (msg, reply) => {
      base.db.models.Stock
         .findOne({ productId: msg.productId })
         .exec()
         .then(stock => {
           let stockToSave = stock || new Stock({});
           Object.assign(stockToSave, msg);
           return stockToSave.save();
         })
         .then(savedStock => {
           if (base.logger.isDebugEnabled) base.logger.debug(`[stock] stock created for product ${savedStock.productId}`);
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
