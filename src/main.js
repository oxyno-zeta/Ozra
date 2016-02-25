/*
 * Copyright (c) 2015 Oxyno-zeta.
 * Licence: See Readme
 */

// Require
var logger = require('./shared/logger.js');
var server = require('./server.js');

// Catch unexpected error and log it
process.on('uncaughtException', function (err) {
    logger.fatal('Caught exception : ' + err.stack);
});

// Initialize server
server.initServer();
// Launch server
server.launch();
