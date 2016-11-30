module.exports = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    reserveStockForMinutes: {
      type: 'number'
    }
  },
  required: [
    'id'
  ],
  additionalProperties: true
};