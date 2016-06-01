function modelFactory(base) {
  if (base.logger.isDebugEnabled()) base.logger.debug('[db] registering model Stock')
  // The root schema
  const schema = base.db.Schema({
    productId: {type: String, required: true},
    warehouseId: {type: String, required: true},
    quantityInStock: {type: Number, required: true},
    quantityReserved: { type: Number, required: true, default: 0 }
  }, {_id: true, minimize: false, timestamps: true});

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
  schema.index({productId: 1});

  // Add the model to mongoose
  return base.db.model('Stock', schema);
}

module.exports = modelFactory;
