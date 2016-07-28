# stock.info

This method is used to obtain information about a Stock

# Arguments

This method has the URL https://server/services/catalog/v1/stock.create and 
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token       | yes | Token   | Bearer xxxxx... | Authentication token.
productId   | yes | String  | HJ4g4fACrH      | The Product id to get info on.
warehouseId | yes | String  | 001             | The Warehouse id to get info on.

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
curl --request GET \
  --url http://localhost:3000/services/catalog/v1/stock.info?productId=HJ4g4fACrH&warehouseId=001 \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json'
```