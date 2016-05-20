const Boom = require('boom');

/**
 * ## `reserve` operation factory
 *
 * @param {base} Object The micro-base object
 * @return {Function} The operation factory
 */
function opFactory(base) {
  // Loads the default warehouse code
  const defaultwarehouseId = base.config.get('defaultwarehouseId');
  const preReserveStock = base.services.loadModule('hooks:preReserveStock:handler');
  const reserveStock = base.services.loadModule('hooks:reserveStock:handler');

  /**
   * ## stock.reserve service
   *
   * Check stock availability and reserve if configured
   */
  function retry(fn, retries, timeout, errorCheck) {
    function recurse(i, rtimeout) {
      return fn().catch(error => {
        if (i < retries && errorCheck(error)) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(recurse(++i, rtimeout + Math.floor(Math.random() * rtimeout)));
            }, rtimeout);
          });
        }
        throw error;
      });
    }

    return recurse(1, timeout);
  }

  function updateStock(productId, quantity, warehouseId, reserveStockForMinutes) {
    return function () {
      return new Promise((resolve, reject) => {
        base.db.models.Stock.findOne({ productId, warehouseId }).exec()
          .then(stock => {
            // Check the product existence
            if (!stock) {
              reject(Boom.notAcceptable(`The product ${productId} doesn't exist`));
            }
            return { stock, quantity, reserveStockForMinutes };
          })
          .then(data => preReserveStock(data))
          .then(data => reserveStock(data))
          .then(data => resolve(data))
          .catch(error => reject(error));
      });
    };
  }

  const op = {
    name: 'reserve',
    handler: ({ productId, quantity, warehouseId = defaultwarehouseId, reserveStockForMinutes }, reply) => {

      // Retries the operation 5 times (with 10ms ramp up times) before giving up, if the "error" is because the concurrency (nmodified!=1)
      return retry(updateStock(productId, quantity, warehouseId, reserveStockForMinutes), 5, 25, error => error.output ? (error.output.statusCode === 412) : false)
        .then(data => {
          if (data.result.code === 301) {
            if (base.logger.isDebugEnabled) base.logger.debug(`[stock] ${data.quantity} stock reserved for product ${data.productId} in warehouse ${data.warehouseId}`);
          }
          return reply(data.result);
        })
        .catch(error => {
          if (error.isBoom) {
            if (error.output.statusCode === 412) {
              base.logger.warn('[stock] Concurrency error');
            }
            return reply(error);
          }
          base.logger.error(error);
          return reply(Boom.wrap(error));
        });
    }
  };

  // Create the worker for the unreserve job
  const unreserveStock = base.services.loadModule('hooks:unreserveStock:handler');
  const unreserve = base.config.get('hooks:unreserveStock:active');
  if (unreserve) {
    unreserveStock(base);
  }

  return op;
}

module.exports = opFactory;
