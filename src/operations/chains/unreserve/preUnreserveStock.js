/**
 * Hook to allow customization of the verification process before the stock unreserve
 */
function factory(base) {
  return (context, next) => {
    if (context.reserve.quantity < context.unreserveQuantity) {
      return next(base.utils.Error('not_enough_stock'));
    }
    if (context.unreserveQuantity < 1) {
      return next(base.utils.Error('wrong_quantity'));
    }
    return next();
  };
}

module.exports = factory;
