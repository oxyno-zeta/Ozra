/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 07/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var cors = require('cors');
var helmet = require('helmet');
var initService = require('./services/initService');
var logger = require('./shared/logger');
var ConfigService = require('./services/configurationService');
var base = require('./routes/routesBase');
var apiRoutes = require('./routes/apiRoutes');

// Get Configuration
var config = ConfigService.getConfig();

// Catch errors
// Catch unexpected error and log it
process.on('uncaughtException', function (err) {
    logger.fatal('Caught exception : ' + err.stack);
});

// Variables
// Express variable
var app = express();

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    initServer: initServer,
    launch: launch,
    getExpressApp: getExpressApp
};

/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Initialize server
 */
function initServer(){
    if (ConfigService.isDeveloperMode()) {
        // Developer mode => use cors
        app.use(cors());
    }
    else {
        // Not developer mode => daemon mode enabled
        require('daemon')();
    }

    logger.info('Begin running...');

    logger.info('Print all configuration variables :');
    var name;
    for (name in config) {
        if (config.hasOwnProperty(name)) {
            logger.info('    * ' + name + ' = ' + config[name]);
        }
    }

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(cookieParser()); // For cookie parsing
    // Put security in place
    app.use(helmet());

    app.use(function (req, res, next) {
        // Log every clients
        base.logClient(req);
        next();
    });

    // Static files and views
    app.set('views', __dirname + '/views');
    app.use('/bower_components', serveStatic(__dirname + '/bower_components/'));
    app.use(serveStatic(__dirname + '/views/'));

    logger.info('Initialize database...');
    // Initialize database
    initService.launch().then(function(){
        logger.info('Server fully launched !');
        // Put api
        apiRoutes.putApiRoutes(app);
    }, function(err){
        // Error
        logger.fatal('Server OFFLINE => DB not initialized => Stop');
        if (ConfigService.isVerbose()){
            logger.debug(err);
        }
    });
}

/**
 * Launch server
 */
function launch(){
    app.listen(ConfigService.getPort());
    logger.info('Server listening !');
}

/**
 * Get Express app
 * @returns {*|exports}
 */
function getExpressApp(){
    return app;
}



