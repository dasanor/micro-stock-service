# stock.reserve.renew

This method is used to renew a reserve.

# Arguments

This method has the URL https://server/services/catalog/v1/stock.reserve.renew and
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token                  | yes | Token   | Bearer xxxxx... | Authentication token.
id                     | yes | String  | HJ4g4fACrH      | The Product id to reserve.
reserveStockForMinutes | no  | Number  | 1440            | The time until the Reserve expires.

The service allows to send a timeout (`reserveStockForMinutes`) for the reserve. 
 If you don't send it, or the service doesn't allow an overwrite of the
 default one (`allowReserveTimeOverwrite` config), the `minutesToReserve`
 config is used.

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
    "warning": "reserve_not_renewed"
}
```

# Errors

Expected errors that this method could return. Some errors return additional data.

Error | Data | Description
------|------|------------
reserve_not_found | - | The reserve was not found

# Example

```bash
curl --request GET \
  --url http://localhost:3000/services/catalog/v1/stock.reserve.renew?id=HJ4g4fACrH \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"reserveStockForMinutes": 1440}'
```