const boom = require('boom');

/**
 * ## `unreserve` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const preUnreserveStock = base.utils.loadModule('hooks:preUnreserveStock:handler');
  const unreserveStock = base.utils.loadModule('hooks:unreserveStock:handler');
  const postUnreserveStock = base.utils.loadModule('hooks:postUnreserveStock:handler');

  /**
   * ## stock.unreserve service
   *
   * Unreserves stock
   */
  const op = {
    name: 'reserve',
    path: '/reserve/{reserveId}',
    method: 'PUT',
    handler: ({ reserveId, unreserveQuantity }, reply) => {
      base.db.models.Reserve
        .findOne({ _id: reserveId })
        .exec()
        .then(reserve => {
          // Check the reserve existence
          if (!reserve) {
            throw (boom.notAcceptable(`The reserve '${reserveId}' doesn't exist.`, { code: 401 }));
          }
          if (reserve.status !== 'ISSUED') {
            throw (boom.notAcceptable(`The reserve '${reserveId}' it's expired.`, { code: 402 }));
          }
          return { reserve, unreserveQuantity };
        })
        .then(data => preUnreserveStock(data))
        .then(data => unreserveStock(data))
        .then(data => postUnreserveStock(data))
        .then(data => reply(data.result))
        .catch(error => {
          if (error.isBoom) return reply(error);
          base.logger.error(error);
          return reply(boom.wrap(error));
        });
    }
  };

  return op;
}

module.exports = opFactory;
