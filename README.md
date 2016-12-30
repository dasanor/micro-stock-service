# Stock Service

[![NPM version][npm-image]][npm-url] 
[![Downloads][downloads-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Coverage Status][coveralls-image]][coveralls-url] 
[![bitHound Overall Score][bithound-overal-image]][bithound-url]
[![bitHound Code][bithound-code-image]][bithound-url]
[![Dependency status][bithound-image]][bithound-url] 
[![Dev Dependency status][bithound-dev-image]][bithound-url] 

[npm-url]:https://npmjs.org/package/microbase
[downloads-image]:http://img.shields.io/npm/dm/microbase.svg
[npm-image]:http://img.shields.io/npm/v/microbase.svg

[travis-url]:https://travis-ci.org/ncornag/micro-stock-service
[travis-image]:http://img.shields.io/travis/ncornag/micro-stock-service/develop.svg
[coveralls-url]:https://coveralls.io/r/ncornag/micro-stock-service
[coveralls-image]:https://img.shields.io/coveralls/ncornag/micro-stock-service/develop.svg

[bithound-url]:https://www.bithound.io/github/ncornag/micro-stock-service/develop
[bithound-overal-image]:https://www.bithound.io/github/ncornag/micro-stock-service/badges/score.svg
[bithound-image]:https://img.shields.io/bithound/dependencies/github/ncornag/micro-stock-service.svg
[bithound-dev-image]:https://img.shields.io/bithound/devDependencies/github/ncornag/micro-stock-service.svg
[bithound-code-image]:https://www.bithound.io/github/ncornag/micro-stock-service/badges/code.svg

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