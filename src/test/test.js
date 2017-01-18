const shortId = require('shortid');

const Code = require('code');
const Lab = require('lab');
const nock = require('nock');
const request = require('supertest');

// shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const beforeEach = lab.beforeEach;
const after = lab.after;
const it = lab.it;
const expect = Code.expect;

const service = require('../index.js');
const base = service.base || service.start().base;
const app = base.transports.http.app;

const defaultHeaders = base.config.get('test:defaultHeaders');
const reserveStockForMinutes = base.config.get('reserveStockForMinutes');

// Check the environment
if (process.env.NODE_ENV !== 'test') {
  console.log('\n[test] THIS ENVIRONMENT IS NOT FOR TEST!\n');
  process.exit(1);
}

// Check the database
if (!base.db.url.includes('test')) {
  console.log('\n[test] THIS DATABASE IS NOT A TEST DATABASE!\n');
  process.exit(1);
}

// Helper to clean the DB
function cleaner(callback) {
  const db = base.db.connections[0];
  var count = Object.keys(db.collections).length;
  Object.keys(db.collections).forEach(colName => {
    const collection = db.collections[colName];
    collection.drop(() => {
      if (--count <= 0 && callback) {
        callback();
      }
    });
  });
}

// Helper to clean the database
function cleanDB(done) {
  cleaner(done);
}

// Helper to initialize the database
function initDB(done) {
  cleanDB(() => {
    createStock()
        .then(() => {
          done();
        });
  });
}

// Helper to inject a call with default parameters
function callService(options) {
  options.method = options.method || 'POST';
  options.headers = options.headers || defaultHeaders;
  const promise = request(app)[options.method.toLowerCase()](options.url);
  Object.keys(options.headers).forEach(key => {
    promise.set(key, options.headers[key]);
  });
  if (options.payload) promise.send(options.payload);
  return promise;
}

// Helper to create Stock
function createStock() {
  return callService({
    url: '/services/stock/v1/stock.create',
    payload: {
      productId: '001',
      warehouseId: '001',
      quantityInStock: 10000,
      quantityReserved: 0
    }
  })
    .then(response => {
      return callService({
        url: '/services/stock/v1/stock.reserve',
        payload: {
          productId: '001',
          warehouseId: '001',
          quantity: 1
        }
      });
    });
}

function getStock(productId, warehouseId){
  return callService({
    url: `/services/stock/v1/stock.info?productId=${productId}&warehouseId=${warehouseId}`
  })
    .then(response =>{
      let stockId = response.body.stock.id;

      return base.db.models.Reserve
        .findOne({stockId : stockId})
        .exec()
    });
}

/*
 Stock Tests
 */
describe('Stock', () => {
  beforeEach(done => {
    initDB(done);
  });
  after(done => {
    cleanDB(done);
  });

  it('renew a reserve', done => {
    getStock('001', '001')
        .then(reserve =>{
          const options = {
            url: '/services/stock/v1/stock.reserve.renew',
            payload : {
              id: reserve.id,
              reserveStockForMinutes: 1440
            }
          };

          return callService(options);
        })
        .then(response => {
          expect(response.statusCode).to.equal(200);
          const result = response.body;
          expect(result.ok).to.equal(true);

          let now = new Date();
          let expirationTime = new Date(result.reserve.expirationTime);
          expect((now.getDay()+1)%7).to.equal(expirationTime.getDay());

          done();
        })
        .catch((error) => done(error));
  });

});
