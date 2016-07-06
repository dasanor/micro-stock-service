const moment = require('moment');
const boom = require('boom');

/**
 * Hook to allow customization of the reserve process
 */
function factory(base) {
  const reserveActive = base.config.get('reserveActive');
  const minutesToReserve = base.config.get('minutesToReserve');
  const allowReserveTimeOverwrite = base.config.get('allowReserveTimeOverwrite');
  return (context, next) => {
    if (reserveActive) {
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
            return next(new boom.preconditionFailed());
          }
          const minutesTo = allowReserveTimeOverwrite ? context.reserveStockForMinutes : minutesToReserve;
          const expirationTime = moment().add(minutesTo, 'minutes').toDate();

          const reserve = new base.db.models.Reserve({
            stockId: context.stock._id,
            warehouseId: context.stock.warehouseId,
            quantity: context.quantity,
            status: 'ISSUED',
            expirationTime
          });

          return reserve.save(); // FIXME if this save fails, the stock level will remain reserved
        })
        .then(reserve => {
          context.result = {
            code: 301,
            msg: 'Stock verified and reserved',
            reserve: {
              id: reserve._id,
              warehouseId: reserve.warehouseId,
              quantity: reserve.quantity,
              expirationTime: reserve.expirationTime
            }
          };
          return next();
        })
        .catch(next);
    } else {
      context.result = { code: 300, msg: 'Stock verified but not reserved' };
      return next();
    }
  };
}

module.exports = factory;
