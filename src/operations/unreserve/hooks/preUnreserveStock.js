const boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock unreserve
 */
function factory(/* base*/) {
  return (context, next) => {
    if (context.reserve.quantity < context.unreserveQuantity) {
      return next(boom.notAcceptable(`The reserve '${context.reserve._id}' doesn't hold enough stock`, { code: 403 }));
    }
    if (context.unreserveQuantity < 1) {
      return next(boom.notAcceptable('Incorrect quantity'));
    }
    return next();
  };
}

module.exports = factory;
