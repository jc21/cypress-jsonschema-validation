import * as Parser from 'json-schema-ref-parser';
import Logger from './logger';
import * as Models from './models';
import Ajv, {ErrorObject} from "ajv"

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
		validateJsonSchema: async (options: Models.IOptions): Promise<ErrorObject<string, Record<string, any>, unknown>[] | null | Error | undefined> => {
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
			const ajv = new Ajv({
				allErrors: true,
				verbose: true,
				strictSchema: false,
			});

			if (verbose) {
				log.debug('Schema:', JSON.stringify(options.schema, null, 2));
				log.debug('Data:', JSON.stringify(options.data, null, 2));
			}

			const validate = ajv.compile(options.schema as any)
			if (validate(options.data)) {
				if (verbose) {
					log.success('Validation Success');
				}
				return null;
			} else {
				log.error(JSON.stringify(validate.errors, null, 2));
				return validate.errors;
			}
		}
	};
}
