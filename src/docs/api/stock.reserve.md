# stock.reserve

This method is used to decrement the Stock in a Warehouse and 
(optionally) create a Reserve.

# Arguments

This method has the URL https://server/services/catalog/v1/stock.reserve and 
follows the [MicroBase API calling conventions](../calling-conventions.html).

Argument | Required | Type | Example | Description
---------|----------|------|---------|------------
token                  | yes | Token   | Bearer xxxxx... | Authentication token.
productId              | yes | String  | HJ4g4fACrH      | The Product id to reserve.
warehouseId            | yes | String  | 001             | The Warehouse id to get info on.
quantity               | yes | Number  | 1               | The quantity to reserve.
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
    "warning": "stock_verified_but_not_reserved"
}
```

# Errors

Expected errors that this method could return. Some errors return additional data.

Error | Data | Description
------|------|------------
stock_not_found | - | The Stock was not found
minimum_quantity_not_met | Minimum quantity | Th Minimum reserve quantity was ont met 
not_enough_stock | - | There is not enough stock for the Product/Warehouse
concurrency_error | - | There was a concurrency error and the Stock was not reserved 

# Example

```bash
curl --request GET \
  --url http://localhost:3000/services/catalog/v1/stock.reserve?productId=HJ4g4fACrH&warehouseId=001 \
  --header 'authorization: Bearer xxxxx...' \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{"quantity": 1, "reserveStockForMinutes": 1440}'
```