# Stock Service

Ecommerce Stock service, part of the [microbase](http://microbase.io) 
ecosystem.

# Features

* Warehose enabled
* Reservation system available with expiration times

# Entities

## Stock

The Stock entity holds the Product inventory.

```javascript
{ 
    "id" : "rkUg-z0D24", 
    "productId" : "HySx-MRw2E", 
    "warehouseId" : "001", 
    "quantityInStock" : 100, 
    "quantityReserved" : 0 
}
```

## Reserve

The Reserves stores information about the reserves in the inventory.

```javascript
{ 
    "id" : "SyVHb8PV", 
    "stockId" : "Syybb0DrDE", 
    "warehouseId" : "001", 
    "quantity" : 1, 
    "status" : "EXPIRED", 
    "expirationTime" : ISODate("2016-06-09T20:29:39.701+0000") 
}
```

Field | Description| Type | Required | Default
------|------------|------|----------|--------
id | Internal unique Stock identifier | String | yes | System generated
stockId | The Stock identifier | String | yes | - 
warehouseId | The warehouse identifier | String | yes | -
quantity | The quantity reserved | yes | Number | -
expirationTime | The Reserve expiration time | Date | yes | -
status | The Reserve status [ISSUED/USED/UNRESERVED/EXPIRED] | String | yes | -

# API

The full API documentation can be accessed in the microbase web http://docs.microbase.io