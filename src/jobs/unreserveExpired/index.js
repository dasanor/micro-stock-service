/**
 * Hook to allow customization of the unreserve expired process
 */
function jobFactory(base) {
  return (params, done) => {
    base.db.models.Reserve
      .find({
        state: 'ISSUED',
        expirationTime: { $lt: new Date() }
      })
      .exec()
      .then(reserves => {
        for (let reserve of reserves) {
          base.db.models.Stock.update({
              _id: reserve.stockId,
              'warehouses.warehouseId': reserve.warehouseId
            }, {
              $inc: {
                'warehouses.$.quantityInStock': reserve.quantity,
                'warehouses.$.quantityReserved': -reserve.quantity,
                '__v': 1
              }
            })
            .then((/* result */) => {
              reserve.state = 'EXPIRED';
              return reserve.save();
            })
            .then((/* result */) => {
              if (base.logger.isDebugEnabled()) base.logger.debug(`[unreserve] unreserved ${reserve._id}`);
            })
            .catch(error => {
              base.logger.error(`[unreserve] ${reserve._id}`, error);
            });
        }
        done();
      })
      .catch(error => {
        base.logger.error(error);
        done(error);
      });
  }
}

module.exports = jobFactory;

