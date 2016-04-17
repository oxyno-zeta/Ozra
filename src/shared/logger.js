/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var log4js = require('log4js');
var configurationService = require('../services/configurationService');
// Load configuration
log4js.configure('log4jsConf.json', {});
// Get logger
var logger = log4js.getLogger('cheese');

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    info: info,
    debug: debug,
    warn: warn,
    error: error,
    fatal: fatal
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */
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
    if (configurationService.isVerbose()){
        logger.debug(text);
    }
}

/**
 * Info log level
 * @param text {*}
 */
function info(text){
    logger.info(text);
}

