# micro-stock-service

Ecommerce Stock service, part of the [microbase](http://microbase.io) 
ecosystem.

# Features

* Warehose enabled
* Reservation system available with expiration times

## Stocks

The Stock entity holds the Product inventory.

Field | Description| Type | Required | Default
------|------------|------|----------|--------
id | Internal unique Stock identifier | String | yes | System generated
productId | The Product identifier | String | yes | -
warehouseId | The warehouse identifier | String | yes | -
quantityInStock | The quantity currently in stock for this Product | Numeric | yes | -
quantityReserved | The quantity currently reserved of this Product | Numeric | yes | -

## Reserves

Field | Description| Type | Required | Default
------|------------|------|----------|--------
id | Internal unique Stock identifier | String | yes | System generated
stockId | The Stock identifier | String | yes | - 
warehouseId | The warehouse identifier | String | yes | -
quantity | The quantity reserved | yes | Number | -
expirationTime | The Reserve expiration time | Date | yes | -
status | The Reserve status [ISSUED/USED/UNRESERVED/EXPIRED] | String | yes | -

## API

The full API documentation can be accessed in the microbase web http://api.microbase.io 
and provide access to the Stocks and Reserves endpoints to create, 
modify and delete them:

### Stocks

Name | Description | Method | Endpoint
-----|-------------|--------|---------
stock:create | Creates a Stock | `POST` | `/services/stock/v1`
stock:get | Retrieves a Stock | `GET` | `/services/stock/v1/{productId}/warehouse/{warehouseId}`
stock:addEntry | Updates a Stock | `PUT` | `/services/stock/v1/{productId}/warehouse/{warehouseId}`

### Reserves

Name | Description | Method | Endpoint
-----|-------------|--------|---------
stock:reserve | Creates a Reserve | `POST` | `/services/stock/v1/reserve`
stock:unreserve | Unreserves Product from a Reserve | `PUT` | `/services/stock/v1/reserve/{reserveId}`
