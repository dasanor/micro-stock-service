const base = require('microbase')();

// Register model(s)
require(base.config.get('models:stockModel'))(base);
require(base.config.get('models:reserveModel'))(base);

// Add operations
base.services.addOperation(require('./operations/create')(base));
base.services.addOperation(require('./operations/get')(base));
base.services.addOperation(require('./operations/update')(base));
base.services.addOperation(require('./operations/reserve')(base));
base.services.addOperation(require('./operations/unreserve')(base));
