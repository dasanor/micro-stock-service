const Boom = require('boom');

/**
 * ## `unreserve` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const preUnreserveStock = base.services.loadModule('hooks:preUnreserveStock:handler');
  const unreserveStock = base.services.loadModule('hooks:unreserveStock:handler');
  const postUnreserveStock = base.services.loadModule('hooks:postUnreserveStock:handler');

  /**
   * ## stock.unreserve service
   *
   * Unreserves stock
   */
  const op = {
    name: 'unreserve',
    handler: ({ reserveId, quantity }, reply) => {
      base.db.models.Reserve
        .findOne({ _id: reserveId, state: 'RESERVED' })
        .exec()
        .then(reserve => {
          // Check the reserve existence
          if (!reserve) {
            return reply(Boom.notAcceptable(`The reserve ${reserveId} doesn't exist or it's expired.`));
          }
          return { reserve, quantity };
        })
        .then(data => preUnreserveStock(data))
        .then(data => unreserveStock(data))
        .then(data => postUnreserveStock(data))
        .then(data => reply(data.result))
        .catch(error => {
          if (error.isBoom) return reply(error);
          base.logger.error(error);
          return reply(Boom.wrap(error));
        });
    }
  };

  return op;
}

module.exports = opFactory;
