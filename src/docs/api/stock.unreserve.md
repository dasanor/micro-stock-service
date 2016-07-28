# stock.unreserve

This method is used to increment the Stock that was previously reserved.

# Arguments

This method has the URL https://server/services/catalog/v1/stock.reserve and 
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token             | yes | Token   | Bearer xxxxx... | Authentication token.
reserveId         | yes | String  | H1ugxlYO        | The Reserve id.
unreserveQuantity | yes | Number  | 1               | The quantity to unreserve.

# Response

Returns a Reserve object if the System is configured to make 
reservations (The Stock is decremented and a Reserve is created):

```javascript
{
    "ok": true,
    "reserve": {
        "id": "H1ugxlYO",
        "warehouseId": "001",
        "quantity": 1,
        "expirationTime": "2016-07-29T15:22:08.285Z"
    }
}
```

Returns a warning if the System is not configured to make reservations 
(The Stock is decremented, but no Reserve is created):

```javascript
{
    "ok": true,
    "warning": "stock_verified_but_not_reserved"
}
```

# Errors

Expected errors that this method could return. Some errors return additional data.

Error | Data | Description
------|------|------------
reserve_not_found | The reserveId not found | The Reserve was not found
reserve_expired | - | The Reserve was already expired
not_enough_stock | - | There is not enough stock in the reserve
wrong_quantity | - | The quantity is < 1
concurrency_error | - | There was a concurrency error and the Stock was not unreserved 

# Example

```bash
curl --request GET \
  --url http://localhost:3000/services/catalog/v1/stock.unreserve?reserveId=H1ugxlYO \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"unreserveQuantity": 1}'
```