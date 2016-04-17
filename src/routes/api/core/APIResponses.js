/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 07/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var logger = require('../../../shared/logger');
var configurationService = require('../../../services/configurationService');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    sendResponse: sendResponse,
    getDefaultResponseBody: getDefaultResponseBody
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 *
 * @param response {object} response The response of the request
 * @param body {object} body The body of the response
 * @param status {Object} status Status code of the response
 * @param success {boolean} success of the response
 */
function sendResponse(response, body, status, success){
	// Update body
	body.reason = status.reason;
	body.success = success;
	// Update response
	response.status(status.code);
	// Debug part
	if (configurationService.isVerbose()) {
		logger.debug('Answer = ' + JSON.stringify(body));
	}
	// Send response
	response.json(body);
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