# Openapi contract validator

DONT PUSH THIS CHANGE MAN

A contract compliance validator for OpenAPI Schemas. Validate a request-response pair against an OpenAPI Schema.

> Note: This is not a validator for the OpenAPI Schemas (OAS) themselves. This package uses an OAS to validate a request-response pair against the truth of the OAS.

> Note: Not intended or optimized for production environments.

If you're not familiar with Node you're probably not the intended audience for this package. This package contains the validator itself for integration into Javascript-based test frameworks. If you're using a non-js framework you're looking for the language agnostic `openapi-contract-validator-server`.

## Installation

```bash
npm install openapi-contract-validator
```

## Supported versions

| OpenAPI Schema version | Supported |
| ---------------------- | :-------: |
| 1.0 (Swagger)          |     ❌     |
| 2.0 (Swagger)          |     ❌     |
| 3.0.x                  |     ✔️     |

## Usage

TL;DR:

```javascript
const {Http, Validator} = require('openapi-contract-validator');

const oas = 'path/to/your/openapi-schema.yaml';

const http = new Http();
http.request.baseUrl = 'http://localhost:8080';
http.request.endpoint = '/api/test';
http.request.method = 'GET';

http.response.statusCode = '200';
http.response.headers = {...};
http.response.body = {...};

const validator = new Validator();
const options = {};

validator
    .validate(oas, http, options)
    .then(() => {
        console.log('Validation passed •‿•');
    })
    .catch((error) => {
        console.error('Validation failed (╯°□°)╯︵ ┻━┻');
        throw error;
    });
```

### Importing

First, require the OAS validator itself:

```javascript
// Require syntax
const {Http, Validator} = require('openapi-contract-validator');
```

```javascript
// Import syntax
import {Http, Validator} from 'openapi-contract-validator';
```

### Define a contract

Before we can validate a request-response pair we'll have to define what is correct. This is documented in an OpenAPI Schema.

Provide the OAS in one of the following ways:

1. An absolute path to the OAS file. Valid file extensions are `.json`, `.js`, `.yaml`, and `.yml`.

    ```javascript
    const oas = 'absolute/path/to/your/openapi-schema.yaml';
    ```

2. An object of paths to the OAS file with a default. The file under `default` will always be used.

    ```javascript
    const oas = {
        default: 'absolute/path/to/your/openapi-schema.json',
        subSchema: 'absolute/path/to/your/openapi-subschema.yaml',
    };
    ```

3. A parsed OAS as an object.

    ```javascript
    const oas = {
        openapi: '3.0.2',
        // ...
    };
    ```

### Detail the HTTP interaction

An HTTP interaction consists of two parts: The request and the response. In order to make `oas-validator` more library-agnostic I've opted to create an intermediary data structure. Create an instance of `Http` and add details to it.

```javascript
const http = new Http();
http.request.baseUrl = 'http://localhost:8080';
http.request.endpoint = '/api/test';
http.request.method = 'GET';

http.response.statusCode = '200';
http.response.headers = {...};
http.response.body = {...};
```

### Validation

The final step is to bring everything together and do the actual validation.

```javascript
const validator = new Validator();
const options = {};

validator
    .validate(oas, http, options)
    .then(() => {
        console.log('Validation passed •‿•');
    })
    .catch((error) => {
        console.error('Validation failed (╯°□°)╯︵ ┻━┻');
        throw error;
    });
```

#### Options

All validator options are optional.

| Option             | Default                 | Description                                                  |
| ------------------ | ----------------------- | ------------------------------------------------------------ |
| `endpoint`         | `http.request.endpoint` | The endpoint as specified in the OpenAPI schema              |
| `method`           | `http.request.method`   | The HTTP method for the endpoint as specified in the OpenAPI schema |
| `statusCode`       | `http.response.method`  | The status code for the HTTP method as specified in the OpenAPI schema |
| `requireAllFields` | `false`                 | Mark all fields in the OpenAPI schema as required            |
| `concatArrays`     | `false`                 | Merge content of arrays into a single value or object        |
| `allowEmptyString` | `false`                 | Allow empty strings and strings that only contain whitespace |

```javascript
// Full options object with default values
const options = {
    endpoint: http.request.endpoint,
    method: http.request.method,
    statusCode: http.response.statusCode,
    requireAllFields: false,
    concatArrays: false,
    allowEmptyString: false,
};
```

## Contributing

Contributors are always welcome! I really don't care if you are a beginner or an expert, all help is welcome. Help includes code contributions, fixing one of my many typos, helping others, etc.
