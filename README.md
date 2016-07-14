# micro-stock-service

Ecommerce Stock service using microbase framework (beta).

MicroBase is a small framework to define and call services, and gives some basic utilities like config, logging, jobs and MongoDB access.
More info abot the framework [here](https://github.com/ncornag/microbase/tree/develop).

## Start

```
cd src
npm install
npm start
```

## Code documentation

The code is documented with `docco` and can be accessed [here](https://rawgit.com/ncornag/micro-stock-service/develop/docs/index.js.html)

## Tests

Shamefully, no tests yet.

## Configuration properties

The configuration properties are handled via the framework and `nconf`. Out of the box the framework
reads the files:

```
config/development.json
config/default.json
node_modules/microbase/modules/config/defaults.json
```

Each file in the list provides sensitive defaults for the previous one.
The file `config/development.json` is built with the `NODE_ENV` environment variable therefore, if
you want to customize the configuration values for a different environment just start node with a
different one.
If `NODE_ENV` is `prod`, the config file used will be `config/prod.json`

## Operations

### set

Creates a new Stock or modifies an existent one

#### Request

```shell
curl --request POST \
  --url http://localhost:3000/services/stock/v1/set \
  --header 'content-type: application/json' \
  --header 'accept: application/json' \
  --data '{"productId": "0001", "warehouses": [{"warehouseId": "001", "quantityInStock": 10000, "quantityReserved": 0}]}'
```

#### Response

The new Stock

```json
{
  "id": "573c7696cfb4475a9150752b",
  "productId": "0001",
  "warehouses": [
    {
      "warehouseId": "001",
      "quantityInStock": 10000,
      "quantityReserved": 0
    }
  ]
}
```

### reserve

Check stock availability and reserves it

#### Request

```shell
curl --request POST \
  --url http://localhost:3000/services/stock/v1/reserve \
  --header 'content-type: application/json' \
  --header 'accept: application/json' \
  --data '{"productId": "0001", "quantity": 1, "warehouseId": "001", "reserveStockForMinutes": 1440}'
```

#### Response

The requested Cart

```json
{
  "code": 301,
  "msg": "Stock verified and reserved",
  "data": {
    "id": "HyQMdzjM",
    "warehouseId": "001",
    "quantity": 1,
    "expirationTime": "2016-05-19T10:42:10.632Z"
  }
}
```

### Customizations

#### Models

The service uses the framework provided db utilities, based in Mongoose.

You can customize the models used modifying the properties under thr `models` key.

The module must follow the following convention:

```javascript
function hook(base) {
  return (data) => {
    return new Promise((resolve, reject) => {

      return resolve(data);
    });
  };
}
module.exports = hook;
```

##### Stock

```json
  "stockModel": "./models/stockModel"
```

##### Reserve

```json
  "reserveModel": "./models/reserveModel"
```

#### Hooks

There is a "hook" system to allow customization of the different parts of the system.

You can provide your own implementation configuring the module to be used in a properties file.

##### preReserveStock

Called before the reserve, used for stock verification and validations

```json
"preReserveStock": {
  "handler": "./modules/stock/hooks/preReserveStock"
}

```
##### reserveStock

Reserves the Stock. Can be disabled with the `active` property.

If the callee wants to overwrite the minutes until the reserve expires, the operation will honor it
depending on the `allowReserveTimeOverwrite` value.

```json
"reserveStock": {
  "active": true,
  "handler": "./modules/stock/hooks/reserveStock",
  "minutesToReserve": 1440,
  "allowReserveTimeOverwrite": false
}
```
