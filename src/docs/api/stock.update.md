# stock.update

This method is used to update Stock data

# Arguments

This method has the URL https://server/services/catalog/v1/stock.create and 
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token            | yes | Token  | Bearer xxxxx... | Authentication token.
productId        | yes | String | HJ4g4fACrH      | The Product id to update the Stock.
warehouseId      | yes | String | 001             | The Warehouse id to update the Stock.

## Updatable fields

See [category.create](./category.create.html) for a fields description.

Name |
-----|
quantityInStock
quantityReserved

# Response

Returns a Stock object:

```javascript
{
    "ok": true,
    "stock": {
        "id": "BkKu-nuu",
        "productId": "HJ4g4fACrH",
        "warehouseId": "001",
        "quantityInStock": 100,
        "quantityReserved": 0
    }
}
```

# Errors

Expected errors that this method could return. Some errors return additional data.

Error | Data | Description
------|------|------------
stock_not_found | - | The Stock was not found

# Example

```bash
curl --request POST \
  --url http://localhost:3000/services/catalog/v1/stock.update?productId=HJ4g4fACrH&warehouseId=001 \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"quantityInStock": 15}'
```