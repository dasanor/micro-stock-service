function modelFactory(base) {
  const warehouseSchema = base.db.Schema({
    warehouseCode: { type: String, required: true },
    quantityInStock: { type: Number, required: true },
    quantityReserved: { type: Number, required: true }
  }, { _id: false, minimize: false });

  const schema = base.db.Schema({
    productCode: { type: String, required: true },
    warehouses: [warehouseSchema]
  }, { _id: true, minimize: false, timestamps: true });

  schema.set('toJSON', {
    virtuals: true
  });

  schema.method('toClient', function() {
    const obj = this.toJSON();
    delete obj._id;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  });

  schema.index({ productCode: 1 });

  return base.db.model('Stock', schema);
}

module.exports = modelFactory;
