const boom = require('boom');

/**
 * ## `unreserve` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {

  const unreserveChain = new base.utils.Chain().use('unreserveChain');

  /**
   * ## stock.unreserve service
   *
   * Unreserves stock
   */
  const op = {
    name: 'reserve',
    path: '/reserve/{reserveId}',
    method: 'PUT',
    handler: (msg, reply) => {
      const context = {
        reserveId: msg.reserveId,
        unreserveQuantity: msg.unreserveQuantity
      };
      unreserveChain
        .exec(context)
        .then(context => reply(context.result))
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
