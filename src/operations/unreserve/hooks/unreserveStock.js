/**
 * Hook to allow customization of the unreserve process
 */
function factory(base) {
  return (context, next) => {
    base.db.models.Stock
      .update({
        _id: context.reserve.stockId
      }, {
        $inc: {
          quantityInStock: context.unreserveQuantity,
          quantityReserved: -context.unreserveQuantity,
          __v: 1
        }
      })
      .then(dbResult => {
        if (dbResult.nModified !== 1) {
          return next(base.utils.Error('concurrency_error'));
        }
        const newStatus = context.reserve.quantity - context.unreserveQuantity === 0 ? 'UNRESERVED' : context.reserve.status;
        return base.db.models.Reserve
          .update({
            _id: context.reserve._id,
            quantity: { $gte: context.unreserveQuantity }
          }, {
            $inc: { quantity: -context.unreserveQuantity },
            status: newStatus
          });
      })
      .then(() => next())
      .catch(next);
  };
}

module.exports = factory;
