const Boom = require('boom');

function stockService(base) {
  base.logger.info(`[service] Instantiating [${base
     .config.get('services:name')}][${base.config.get('services:version')}]`);

  // Loads the default warehouse code
  const defaultwarehouseId = base.config.get('defaultwarehouseId');

  // Register model(s)
  const Stock = require(base.config.get('models:stockModel'))(base);
  const Reserve = require(base.config.get('models:reserveModel'))(base);

  /**
   * ## stock.set service
   *
   * Creates a new stock or modifies an existent one
   */
  const setStock = {
    name: 'set',
    handler: (msg, reply) => {
      Stock.findOne({ productId: msg.productId }).exec()
         .then(stock => {
           let stockToSave = stock || new Stock({});
           Object.assign(stockToSave, msg);
           return stockToSave.save();
         })
         .then(savedStock => {
           if (base.logger.isDebugEnabled) base.logger.debug(`[stock] stock created for product ${savedStock.productId}`);
           return reply(savedStock.toClient());
         })
         .catch(error => {
           base.logger.error(error);
           reply(Boom.wrap(error));
         });
    }
  };

  /**
   * ## stock.reserve service
   *
   * Check stock availability and reserve if configured
   */

  function retry(fn, retries, timeout, errorCheck) {
    function recurse(i, timeout) {
      return fn().catch(error => {
        if (i < retries && errorCheck(error)) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(recurse(++i, timeout + Math.floor(Math.random() * timeout)));
            }, timeout);
          });
        }
        throw error;
      });
    }

    return recurse(1, timeout);
  }

  const preReserveStock = base.services.loadModule('hooks:preReserveStock:handler');
  const reserveStock = base.services.loadModule('hooks:reserveStock:handler');

  function updateStock(productId, quantity, warehouseId, reserveStockForMinutes) {
    return function() {
      return new Promise((resolve, reject) => {
        Stock.findOne({ productId }).exec()
           .then(stock => {
             // Check the product existence
             if (!stock) {
               reject(Boom.notAcceptable(`The product ${productId} doesn't exist`));
             }
             return { stock, productId, quantity, warehouseId, reserveStockForMinutes };
           })
           .then(data => preReserveStock(data))
           .then(data => reserveStock(data))
           .then(data => resolve(data))
           .catch(error => reject(error));
      });
    };
  }

  const reserveProduct = {
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

  return [
    setStock,
    reserveProduct
  ];
}

module.exports = stockService;
