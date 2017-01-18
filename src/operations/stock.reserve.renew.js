const moment = require('moment');
/**
 * ## `stock.reserve.renew` operation factory
 *
 * @param {base} Object The microbase object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  const reserveActive = base.config.get('reserveActive');
  const minutesToReserve = base.config.get('minutesToReserve');
  const allowReserveTimeOverwrite = base.config.get('allowReserveTimeOverwrite');

  const op = {
    validator: {
      schema: base.utils.loadModule('schemas:renewReserve')
    },
    handler: (msg, reply) => {
      if (reserveActive) {
        const id = msg.id;

        base.db.models.Reserve
          .findOne({ _id: id })
          .exec()
          .then(reserve => {
            if (!reserve) throw base.utils.Error('reserve_not_found', id);

            if(new Date() > reserve.expirationTime) throw base.utils.Error('reserve_expired', id);

            const minutesTo = allowReserveTimeOverwrite ? msg.reserveStockForMinutes : minutesToReserve;
            const expirationTime = moment().add(minutesTo, 'minutes').toDate();

            reserve.expirationTime = expirationTime;

            return reserve.save();
          })
          .then(savedReserve => {
            if (base.logger.isDebugEnabled()) base.logger.debug(`[stock] reserve ${savedReserve._id} renewed`);

            return reply(base.utils.genericResponse({ reserve: savedReserve.toClient() }));
          })
          .catch(error => {
            return reply(base.utils.genericResponse(null, error));
          });
      } else {
        return reply(base.utils.genericResponse({warning: 'reserve_not_renewed'}));
      }
    }
  };
  return op;
}

module.exports = opFactory;
