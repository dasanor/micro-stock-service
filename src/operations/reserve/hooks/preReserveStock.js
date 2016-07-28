/**
 * Hook to allow customization of the verification process before the stock reserve
 */
function factory(base) {
  const minQuantity = base.config.get('minQuantity');
  return (context, next) => {
    // Check min quantity
    if (context.quantity < minQuantity) {
      return next(base.utils.Error('minimum_quantity_not_met', minQuantity));
    }
    // Check Stock
    if (context.stock.quantityInStock < context.quantity) {
      next(base.utils.Error('not_enough_stock'));
    }
    return next();
  };
}

module.exports = factory;
