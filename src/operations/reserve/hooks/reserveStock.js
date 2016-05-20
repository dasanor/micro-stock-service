const moment = require('moment');
const shortId = require('shortid');
const Boom = require('boom');

/**
 * Hook to allow customization of the verification process before the stock reserve
 */
function reserveStock(base) {
  const reserve = base.config.get('hooks:reserveStock:active');
  const minutesToReserve = base.config.get('hooks:reserveStock:minutesToReserve');
  const allowReserveTimeOverwrite = base.config.get('hooks:reserveStock:allowReserveTimeOverwrite');
  return (data /* stock, quantity, reserveStockForMinutes */) => {
    return new Promise((resolve, reject) => {

      if (reserve) {
        return base.db.models.Stock.update({
            _id: data.stock._id,
            __v: data.stock.__v,
            warehouseId: data.stock.warehouseId
          }, {
            $inc: {
              quantityInStock: -data.quantity,
              quantityReserved: data.quantity
            },
            '__v': data.stock.__v + 1
          })
          .then((dbResult) => {
            if (dbResult.nModified !== 1) {
              return reject(new Boom.preconditionFailed());
            }
            const minutesTo = allowReserveTimeOverwrite ? data.reserveStockForMinutes : minutesToReserve;
            const expirationTime = moment().add(minutesTo, 'minutes').toDate();
            const reserveCode = shortId.generate();

            const reserve = new base.db.models.Reserve({
              _id: reserveCode,
              stockId: data.stock._id,
              warehouseId: data.stock.warehouseId,
              quantity: data.quantity,
              state: 'ISSUED',
              expirationTime
            });

            return reserve.save(); // FIXME if this save fails, the stock level will remain reserved
          })
          .then((reserve) => {
            data.result = {
              code: 301,
              msg: 'Stock verified and reserved',
              reserve: {
                id: reserve._id,
                warehouseId: reserve.warehouseId,
                quantity: reserve.quantity,
                expirationTime: reserve.expirationTime
              }
            };
            return resolve(data);
          })
          .catch(error => reject(error));
      }
      data.result = { code: 300, msg: 'Stock verified but not reserved' };
      return resolve(data);
    });
  };
}

module.exports = reserveStock;
