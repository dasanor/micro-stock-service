const base = require('micro-base')();

// Register model(s)
require(base.config.get('models:stockModel'))(base);
require(base.config.get('models:reserveModel'))(base);

// Add operations
base.services.add(require('./operations/set')(base));
base.services.add(require('./operations/reserve')(base));
