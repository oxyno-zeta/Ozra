/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 07/12/15
 * Licence: See Readme
 */

// Require
var logger = require('../../../shared/logger.js');
var ConfigService = require('../../../shared/configuration.js');

// Exports
module.exports = {
    sendResponse: sendResponse,
    getDefaultResponseBody: getDefaultResponseBody
};

// Functions
/**
 *
 * @param response {object} response The response of the request
 * @param body {object} body The body of the reponse
 * @param status {int} status Status code of the response
 * @param success {boolean} success of the response
 */
function sendResponse(response, body, status, success){
	// Update body
	body.reason = status.reason;
	body.success = success;
	// Update response
	response.status(status.code);
	response.set({'Content-Type': 'application/json'});
	// Debug part
	if (ConfigService.getVerbose()) {
		logger.debug('Answer = ' + JSON.stringify(body));
	}
	// Send response
	response.send(body);
}

/**
 * Return default response body
 * @param token {string} token
 * @returns {{success: boolean, reason: string}}
 */
function getDefaultResponseBody(token){
	var body = {
		success : false,
		reason: ''
	};

	if (token){
		body.token = token;
	}

	return body;
}