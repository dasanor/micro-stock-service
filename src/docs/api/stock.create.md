# stock.create

This method is used to create a Stock.

# Arguments

This method has the URL https://server/services/catalog/v1/stock.create and 
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token            | yes | Token  | Bearer xxxxx... | Authentication token.
productId        | yes | String | HJ4g4fACrH      | The Product identifier.
warehouseId      | yes | String | 001             | The warehouse identifier.
quantityInStock  | yes | Number | 100             | The quantity currently in stock for this Product.
quantityReserved | yes | Number | 0               | The quantity currently reserved of this Product.

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
duplicate_key | Index name and data causing the error | Some unique key violation
validation_error | The data causing the error | Some validation error

# Example

```bash
curl --request POST \
  --url http://localhost:3000/services/catalog/v1/stock.create \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"productId": "HJ4g4fACrH", "warehouseId": "001", \
           "quantityInStock": 100, "quantityReserved": 0}'
```