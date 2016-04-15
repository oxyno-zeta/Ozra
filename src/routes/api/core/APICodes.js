/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

// Errors code for clients
var clientErrors = {
	BAD_REQUEST: {
		code: 400,
		reason: 'Bad request'
	},
	NOT_AUTHORIZED: {
		code : 401,
		reason: 'Not Authorized'
	},
	FORBIDDEN: {
		code: 403,
		reason: 'Forbidden'
	},
	NOT_FOUND: {
		code: 404,
		reason: 'Not Found'
	},
	CONFLICT: {
		code: 409,
		reason: 'Conflict'
	}
};

// Server errors
var serverErrors = {
	INTERNAL_ERROR: {
		code: 500,
		reason: 'Internal error'
	}
};

// Normal codes
var normal = {
	OK: {
		code: 200,
		reason: 'Ok'
	},
	CREATED: {
		code: 201,
		reason: 'Created'
	}
};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    clientErrors: clientErrors,
    normal: normal,
    serverErrors: serverErrors
};
