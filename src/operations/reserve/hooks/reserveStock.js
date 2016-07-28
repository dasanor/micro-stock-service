const moment = require('moment');
/**
 * Hook to allow customization of the reserve process
 */
function factory(base) {
  const reserveActive = base.config.get('reserveActive');
  const minutesToReserve = base.config.get('minutesToReserve');
  const allowReserveTimeOverwrite = base.config.get('allowReserveTimeOverwrite');
  return (context, next) => {
    base.db.models.Stock
      .update({
        _id: context.stock._id,
        warehouseId: context.stock.warehouseId,
        quantityInStock: { $gte: context.quantity }
      }, {
        $inc: {
          quantityInStock: -context.quantity,
          quantityReserved: context.quantity,
          __v: 1
        }
      })
      .then(dbResult => {
        if (dbResult.nModified !== 1) {
          return next(base.utils.Error('concurrency_error'));
        }
        if (reserveActive) {
          const minutesTo = allowReserveTimeOverwrite ? context.reserveStockForMinutes : minutesToReserve;
          const expirationTime = moment().add(minutesTo, 'minutes').toDate();

          const reserve = new base.db.models.Reserve({
            stockId: context.stock._id,
            warehouseId: context.stock.warehouseId,
            quantity: context.quantity,
            status: 'ISSUED',
            expirationTime
          });

          reserve
            .save() // FIXME if this save fails, the stock level will remain reserved
            .then(reserve => {
              context.result = {
                reserve: {
                  id: reserve._id,
                  warehouseId: reserve.warehouseId,
                  quantity: reserve.quantity,
                  expirationTime: reserve.expirationTime
                }
              };
              return next();
            })
        } else {
          context.result = {
            warning: 'stock_verified_but_not_reserved'
          };
          return next();
        }
      })
      .catch(next);
  };
}

module.exports = factory;
