const boom = require('boom');

/**
 * Retrieve the reserve
 */
function factory(base) {
  return (context, next) => {
    base.db.models.Reserve
      .findOne({ _id: context.reserveId })
      .exec()
      .then(reserve => {
        // Check the reserve existence
        if (!reserve) {
          return next(boom.notAcceptable(`The reserve '${context.reserveId}' doesn't exist.`, { code: 401 }));
        }
        if (reserve.status !== 'ISSUED') {
          return next(boom.notAcceptable(`The reserve '${context.reserveId}' it's expired.`, { code: 402 }));
        }
        context.reserve = reserve;
        return next();
      })
      .catch(next);
  };
}

module.exports = factory;
