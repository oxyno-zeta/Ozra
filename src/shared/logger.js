/*
 * Copyright (c) 2015 Oxyno-zeta.
 * Licence: See Readme
 */

// Require
var log4js = require('log4js');
// Load configuration
log4js.configure('log4js_Configuration.json', {});
// Get logger
var logger = log4js.getLogger('cheese');

// Export
module.exports = {
    info: logger.info,
    trace: logger.trace,
    debug: logger.debug,
    warn: logger.warn,
    error: logger.error,
    fatal: logger.fatal
};
