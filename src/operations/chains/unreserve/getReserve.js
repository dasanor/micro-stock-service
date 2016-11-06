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
          return next(base.utils.Error('reserve_not_found', context.reserveId));
        }
        if (reserve.status !== 'ISSUED') {
          return next(base.utils.Error('reserve_expired'));
        }
        context.reserve = reserve;
        return next();
      })
      .catch(next);
  };
}

module.exports = factory;
