/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

//Require
var logger = require('../shared/logger.js');

// Exports
module.exports = {
    logClient: logClient,
    logClientError: logClientError
};


// Functions
/**
 * Log client
 * @param req {object} request
 */
function logClient(req){
    // Get ip address
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Log Request
    logger.info('Client IP Address = ' + ip + '  |  URL = ' + req.url);
}

/**
 * Log client error
 * @param req {object} request
 */
function logClientError(req){
    // Get ip address
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Log Request
    logger.error('Client IP Address = ' + ip + '  |  URL = ' + req.url + '  |  Method = ' + req.method);
}

