import {JsonSchemaValidation} from './index';

const schemaObject = {
	type: 'object',
	additionalProperties: false,
	properties: {
		result: {
			type: 'object',
			additionalProperties: false,
			required: [
				'commit',
				'healthy',
				'checks'
			],
			properties: {
				commit: {
					type: 'string',
					description: 'Commit hash',
					example: '88cb49b8f8d4d9ce7c4825aa13410b849bf99878',
					minLength: 8
				},
				healthy: {
					type: 'boolean',
					description: 'Healthy?',
					example: true
				},
				checks: {
					type: 'object',
					description: 'Checks to determine health',
					additionalProperties: false,
					required: [
						'databases'
					],
					properties: {
						databases: {
							type: 'object',
							description: 'Databases are reachable'
						}
					}
				}
			}
		},
		error: {
			type: 'object',
			description: 'Error object',
			additionalProperties: false,
			required: [
				'code',
				'message'
			],
			properties: {
				code: {
					type: 'integer',
					description: 'Error code',
					minimum: 0
				},
				message: {
					type: 'string',
					description: 'Error message'
				}
			}
		}
	}
};

test('test schema file', async () => {
	const sv = JsonSchemaValidation();

	const result = await sv.validateJsonSchema({
		schemaFile: './testing/schema-1.json',
		data: {
			result: {
				checks: {
					databases: {
						healthy: true
					}
				},
				commit: '88cb49b8f8d4d9ce7c48',
				healthy: true
			}
		},
		verbose: true,
	});

	expect(result).toBe(null);
});

test('test schema file Invalid', async () => {
	const sv = JsonSchemaValidation();

	const result = await sv.validateJsonSchema({
		schemaFile: './testing/schema-1.json',
		data: {
			result: {
				checks: {
					databases: {
						healthy: true
					}
				},
				healthy: true
			}
		},
		verbose: true,
	});

	expect(typeof result).toBe('object');
	expect(getValidationErrorStrings(result)).toBe('must have required property \'commit\'');
});

test('test schema object', async () => {
	const sv = JsonSchemaValidation();

	const result = await sv.validateJsonSchema({
		schema: schemaObject,
		data: {
			result: {
				checks: {
					databases: {
						healthy: true
					}
				},
				commit: '88cb49b8f8d4d9ce7c48',
				healthy: true
			}
		},
		verbose: true,
	});

	expect(result).toBe(null);
});

test('test schema object Invalid', async () => {
	const sv = JsonSchemaValidation();

	const result = await sv.validateJsonSchema({
		schema: schemaObject,
		data: {
			result: {
				checks: {
					databases: {
						healthy: true
					}
				},
				healthy: true
			}
		},
		verbose: true,
	});

	expect(typeof result).toBe('object');
	expect(getValidationErrorStrings(result)).toBe('must have required property \'commit\'');
});

const getValidationErrorStrings = (errors: any): string => {
	if (typeof errors === 'object' && errors !== null) {
		const s = errors.map((error: any) => error.message);
		return s.join(', ');
	}
	return JSON.stringify(errors);
};
