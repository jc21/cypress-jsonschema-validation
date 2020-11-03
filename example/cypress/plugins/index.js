/// <reference types="cypress" />

const { JsonSchemaValidation } = require('@jc21/cypress-jsonschema-validation');

module.exports = (on, config) => {
	on('task', JsonSchemaValidation(config));
	on("task", {
		log(message) {
			console.log(message);
			return null;
		},
	});

	return config;
};
