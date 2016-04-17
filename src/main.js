/*
 * Copyright (c) 2015 Oxyno-zeta.
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var logger = require('./shared/logger');
var server = require('./server');

// Catch unexpected error and log it
process.on('uncaughtException', function (err) {
    logger.fatal('Caught exception : ' + err.stack);
});

// Initialize server
server.initServer();
// Launch server
server.launch();
