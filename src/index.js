const base = require('microbase')();

// Register model(s)
require(base.config.get('models:stockModel'))(base);
require(base.config.get('models:reserveModel'))(base);

// Add operations
base.services.add(require('./operations/create')(base));
base.services.add(require('./operations/get')(base));
base.services.add(require('./operations/update')(base));
base.services.add(require('./operations/reserve')(base));
base.services.add(require('./operations/unreserve')(base));
