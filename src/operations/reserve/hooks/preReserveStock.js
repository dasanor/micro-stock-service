const boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock reserve
 */
function factory(base) {
  const minQuantity = base.config.get('minQuantity');
  return (context, next) => {
    // Check min quantity
    if (context.quantity < minQuantity) {
      return next(boom.notAcceptable(`The minimum quantity is ${minQuantity}`));
    }
    // Check Stock
    if (context.stock.quantityInStock < context.quantity) {
      next(boom.notAcceptable(`The warehouse '${context.stock.warehouseId}' doesn't have enough stock for the product '${context.stock.productId}'`));
    }
    return next();
  };
}

module.exports = factory;
