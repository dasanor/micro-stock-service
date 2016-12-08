const shortId = require('shortid');

function modelFactory(base, configKeys) {
  const modelName = configKeys[configKeys.length - 1];
  if (base.logger.isDebugEnabled()) base.logger.debug(`[db] registering model '${modelName}'`);

  // The root schema
  const schema = base.db.Schema({
    _id: {
      type: String, required: true, default: function () {
        return shortId.generate();
      }
    },
    stockId: { type: String, required: true },
    warehouseId: { type: String, required: true },
    quantity: { type: Number, required: true },
    expirationTime: { type: Date, required: true },
    status: { type: String, required: true } // [ ISSUED | USED | UNRESERVED | EXPIRED ]
  }, { _id: false, minimize: false, timestamps: true });

  // Enable the virtuals when converting to JSON
  schema.set('toJSON', {
    virtuals: true
  });

  // Add a method to clean the object before sending it to the client
  schema.method('toClient', function () {
    const obj = this.toJSON();
    delete obj._id;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  });

  // Add the indexes
  schema.index({ status: 1, expirationTime: 1 });

  const model = base.db.model(modelName, schema);

  // Add the model to mongoose
  return model;
}

module.exports = modelFactory;
