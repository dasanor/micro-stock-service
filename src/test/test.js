const shortId = require('shortid');

const Code = require('code');
const Lab = require('lab');
const nock = require('nock');
const request = require('supertest-as-promised');

// shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const beforeEach = lab.beforeEach;
const after = lab.after;
const it = lab.it;
const expect = Code.expect;

const base = require('../index.js');
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
  });
}

function getStock(productId, warehouseId){
  return callService({
    url: `/services/stock/v1/stock.info?productId=${productId}&warehouseId=${warehouseId}`
  })
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
    const options = {
      url: '/services/cart/v1/cart.create'
    };
    getStock('001', '001')
        .then(response =>{
          const options = {
            url: '/services/stock/v1/stock.reserve.renew',
            payload : {
              id: response.body.data[0].id,
              reserveStockForMinutes: 60
            }
          };

          return callService(options);
        })
        .then(response => {
          expect(response.statusCode).to.equal(200);
          const result = response.body;
          expect(result.ok).to.equal(true);

          done();
        })
        .catch((error) => done(error));
  });

});
