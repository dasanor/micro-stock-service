const baseFactory = require('micro-base');
const stockFactory = require('./modules/stock');

// Instantiate micro-base
const base = baseFactory();

// Add operations
base.services.addModule(stockFactory(base));

// Return express app for easy testing
module.exports = base.app;
