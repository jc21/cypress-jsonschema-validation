import * as Parser from 'json-schema-ref-parser';
import Logger from './logger';
import * as Models from './models';

const defaultLog = new Logger('cypress-jsonschema-validation');

export function JsonSchemaValidation() {
	defaultLog.success('Plugin Loaded');

	return {
		/**
		 * @param   {object}        options
		 * @param   {object}        options.data
		 * @param   {string}        [options.schemaFile]
		 * @param   {object}        [options.schema]
		 * @param   {boolean}       [options.verbose]
		 * @returns {string|null}   Errors or null if OK
		 */
		validateJsonSchema: async (options: Models.IOptions): Promise<Error | null> => {
			const log = new Logger('validateJsonSchema');

			if (!options.schemaFile && !options.schema) {
				return new Error('Neither `schemaFile` or `schema` was specified');
			}

			if (options.schemaFile && options.schema) {
				return new Error('You must only define `schemaFile` or `schema` not both');
			}

			if (!options.data) {
				return new Error('`data` to validate was not specified');
			}

			const verbose = options.verbose || false;
			if (options.schemaFile) {
				options.schema = await Parser.dereference(options.schemaFile)
			}

			// Now validate the endpoint schema against the response
			const Ajv = require('ajv')({
				allErrors: true,
				format: 'full',
				nullable: true,
				verbose: true,
			});

			if (verbose) {
				log.debug('Schema:', JSON.stringify(options.schema, null, 2));
				log.debug('Data:', JSON.stringify(options.data, null, 2));
			}

			const valid = Ajv.validate(options.schema, options.data);
			if (valid && !Ajv.errors) {
				if (verbose) {
					log.success('Validation Success');
				}
				return null;
			} else {
				log.error(Ajv.errorsText());
				return Ajv.errorsText();
			}
		}
	};
}
