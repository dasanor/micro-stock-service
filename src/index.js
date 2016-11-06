const base = require('microbase')();

// Register model(s)
require(base.config.get('models:stockModel'))(base);
require(base.config.get('models:reserveModel'))(base);

// Add operations
base.services.addOperationsFromFolder();
