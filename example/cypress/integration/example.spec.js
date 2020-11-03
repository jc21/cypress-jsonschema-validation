/// <reference types="Cypress" />

describe('Basic API checks', () => {
	const EXAMPLE_PAYLOAD_1 = {
		result: {
			commit: '9f119b6',
			healthy: true
		}
	};

	const EXAMPLE_PAYLOAD_2 = {
		result: {
			commit: '9f119b6',
			healthy: 'true'
		}
	};

	it('Payload should be VALID', function () {
		cy.task('validateJsonSchema', {
			schemaFile: './cypress/fixtures/health-schema.json',
			data:       EXAMPLE_PAYLOAD_1,
			verbose:    true
		}).should('equal', null);
	});

	it('Payload should be INVALID', function () {
		cy.task('validateJsonSchema', {
			schemaFile: './cypress/fixtures/health-schema.json',
			data:       EXAMPLE_PAYLOAD_2,
			verbose:    true
		}).should('equal', 'data.result.healthy should be boolean');
	});
});
