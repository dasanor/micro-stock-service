/**
 * ## `stock.unreserve` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {

  const unreserveChain = new base.utils.Chain().use('unreserveChain');

  const op = {
    handler: (msg, reply) => {
      const context = {
        reserveId: msg.reserveId,
        unreserveQuantity: msg.unreserveQuantity
      };
      unreserveChain
        .exec(context)
        .then(context => reply(base.utils.genericResponse(context.result)))
        .catch(error => reply(base.utils.genericResponse(null, error)));
    }
  };

  return op;
}

module.exports = opFactory;
