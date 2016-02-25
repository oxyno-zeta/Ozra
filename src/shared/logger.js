/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */

// Require
var log4js = require('log4js');
// Load configuration
log4js.configure('log4jsConf.json', {});
// Get logger
var logger = log4js.getLogger('cheese');

// Export
module.exports = {
    info: info,
    trace: trace,
    debug: debug,
    warn: warn,
    error: error,
    fatal: fatal
};

// Functions
/**
 * Fatal log level
 * @param text {*}
 */
function fatal(text){
    logger.fatal(text);
}

/**
 * Error log level
 * @param text {*}
 */
function error(text){
    logger.error(text);
}

/**
 * Warn log level
 * @param text {*}
 */
function warn(text){
    logger.warn(text);
}

/**
 * Debug log level
 * @param text {*}
 */
function debug(text){
    logger.debug(text);
}

/**
 * Trace log level
 * @param text {*}
 */
function trace(text){
    logger.trace(text);
}

/**
 * Info log level
 * @param text {*}
 */
function info(text){
    logger.info(text);
}

