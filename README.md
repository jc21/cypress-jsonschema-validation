# Cypress JSON Schema Validation Plugin

Validate data payload against a given JSON Schema.

[![npm (scoped)](https://img.shields.io/npm/v/@jc21/cypress-jsonschema-validation.svg?style=for-the-badge)](https://www.npmjs.com/package/@jc21/cypress-jsonschema-validation)
[![npm (types)](https://img.shields.io/npm/types/@jc21/cypress-jsonschema-validation.svg?style=for-the-badge)](https://www.npmjs.com/package/@jc21/cypress-jsonschema-validation)
[![npm (licence)](https://img.shields.io/npm/l/@jc21/cypress-jsonschema-validation.svg?style=for-the-badge)](https://www.npmjs.com/package/@jc21/cypress-jsonschema-validation)


### Cypress Installation

```bash
yarn add @jc21/cypress-jsonschema-validation
```

Then in your cypress Plugins file:
```javascript
const {JsonSchemaValidation} = require('@jc21/cypress-jsonschema-validation');

module.exports = (on, config) => {
    // ...
    on('task', JsonSchemaValidation(config));
    // ...
    return config;
};
```


### Cypress Usage

```javascript
describe('Basic API checks', () => {
    it('Should return a valid health payload', function () {
        cy.request('/healthz').then($response => {
            cy.task('validateJsonSchema', {
                data:           $response.body,
                verbose:        true,                     // optional, default: false
                schemaFile:     './testing/schema.json',  // path or full URL, see below
                // Or you can also define the schema inline:
                schema:         {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        }
                    }
                },
            }).should('equal', null);
        });
    });
});
```

### The Schema

You can provide the `schemaFile` or the `schema`. One of these options is required and using both will cause an error.

The `schemaFile` can either be a file on disk or a URL. When using a file on disk and due to the fact that this plugin
runs on the Cypress Backend, the location of the file must be defined as either the full path on disk or relative path
to the running of the cypress command.


### Options

| Option           | Description                                                   | Optional                   | Default                  |
| ---------------- | ------------------------------------------------------------- | -------------------------- | ------------------------ |
| `schemaFile`     | The location of the schema file to use for validation         | when `schema` provided     |                          |
| `schema`         | Schema to use for validation. Cannot be used with schemaFile  | when `schemaFile` provided |                          |
| `data`           | The payload to validate                                       |                            |                          |
| `verbose`        | Console.log more info when validation fails                   | true                       | false                    |


### Compiling Source

```bash
yarn install
yarn build
yarn test
```
