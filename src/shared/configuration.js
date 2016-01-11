/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */

var nconf = require('nconf');
var _ = require('lodash');

// Save config
var config;

// Variables
var ENV = 'OZRA_ENV';
var PORT = 'OZRA_PORT';
var VERBOSE = 'OZRA_VERBOSE';
var DATABASE_NAME = 'OZRA_DATABASE_NAME';
var DATABASE_URL = 'OZRA_DATABASE_SERVER_URL';
var POSSIBLE_ENV = ['dev', 'prod'];

// Default configuration
var DEFAULT_CONFIG = {
    'OZRA_ENV': 'dev',
    'OZRA_PORT': 2049,
    'OZRA_VERBOSE': true,
    'OZRA_DATABASE_SERVER_URL': '',
    'OZRA_DATABASE_NAME': 'Ozra_database'
};

/**
 * 1) Default
 * 2) Configuration file
 * 3) Env variables
 * 4) Command line
 */
// Configuration file
nconf.file({file: 'config.json'});
// Environment variables
nconf.env();
// Command line
nconf.argv();
// Default
nconf.defaults(DEFAULT_CONFIG);

// Exports
module.exports = {
    getConfig: getConfig,
    getPort: getPort,
    isVerbose: isVerbose,
    isDeveloperMode: isDeveloperMode,
    getDatabaseConfig: getDatabaseConfig
};

/**
 * Get configuration
 * @returns {*}
 */
function getConfig(){
    // Check if config ready
    if (_.isUndefined(config)){
        config = {};
        var key;
        for (key in DEFAULT_CONFIG){
            if (DEFAULT_CONFIG.hasOwnProperty(key)) {
                config[key] = nconf.get(key);
            }
        }

        var authorized = false;
        _.forEach(POSSIBLE_ENV, function(env){
            if (_.isEqual(config[ENV], env)){
                authorized = true;
            }
        });

        if (!authorized){
            config[ENV] = 'dev';
        }
    }

    return config;
}

/**
 * Get server port
 * @returns {*}
 */
function getPort(){
    return this.getConfig()[PORT];
}

/**
 * Is verbose mode enable
 * @returns {*}
 */
function isVerbose() {
    return getConfig()[VERBOSE];
}

/**
 * Is developer mode enable
 * @returns {boolean}
 */
function isDeveloperMode(){
    return _.isEqual(getConfig()[ENV], 'dev');
}

/**
 * Get database configuration
 * @returns {*}
 */
function getDatabaseConfig(){
    var _config = getConfig();
    // Get URL
    var url = _config[DATABASE_URL];
    // Verify url
    if (!_.isEqual(url.length, 0) && !_.isEqual(url[url.length], '/')){
        url += '/';
    }
    var name = _config[DATABASE_NAME];

    return url + name;
}
