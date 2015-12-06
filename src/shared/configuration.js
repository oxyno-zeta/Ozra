/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/12/2015
 * Licence: See Readme
 */

// Save config
var config;

// Variables
var MODE = 'OZRA_ENV';
var PORT = 'OZRA_PORT';
var VERBOSE = 'OZRA_VERBOSE';
var DATABASE = 'OZRA_DATABASE';
var ENV_VARIABLES = [MODE, PORT, VERBOSE, DATABASE];
var POSSIBLE_ENV = ['dev', 'prod'];

// Default configuration
var DEFAULT_CONFIG = {
    'OZRA_ENV': 'dev',
    'OZRA_PORT': 2049,
    'OZRA_VERBOSE': true,
    'OZRA_DATABASE': 'Ozra_database'
};

/**
 * Transform type of configuration entries
 * @param key {string} JSON key
 * @param DEFAULT_CONFIG {object} Default configuration
 * @param config {object} Configuration
 * @returns {*}
 */
function transformType(key, DEFAULT_CONFIG, config){
    switch (typeof DEFAULT_CONFIG[key]) {
        case 'boolean':
            return (config[key] === 'true');
        case 'number':
            return parseInt(config[key], 10);
        /* istanbul ignore next */
        default :
            return config[key];
    }
}

/**
 * Update configuration
 * @returns {{}}
 */
function update(){
    // Config doesn't ready -> build it
    config = {};
    var i;
    var value;
    for (i = 0; i < ENV_VARIABLES.length; i++){
        value = process.env[ENV_VARIABLES[i]];
        if (value !== undefined){
            config[ENV_VARIABLES[i]] = value;
        }
        else {
            config[ENV_VARIABLES[i]] = DEFAULT_CONFIG[ENV_VARIABLES[i]];
        }
    }

    if (POSSIBLE_ENV.indexOf(config[MODE]) === -1){
        // Environment not usable
        // Using dev
        config[MODE] = 'dev';
    }

    // Transform string to other (int or boolean) when necessary
    var key;
    for (key in DEFAULT_CONFIG){
        if ( DEFAULT_CONFIG.hasOwnProperty(key) && ((typeof DEFAULT_CONFIG[key]) !== (typeof config[key])) ){
            config[key] = transformType(key, DEFAULT_CONFIG, config);
        }
    }

    return config;
}

/**
 * Get configuration
 * @returns {*}
 */
function getConfig(){
    // Check if config ready
    if (config !== undefined){
        return config;
    }

    return update();
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
    return (getConfig()[MODE] === 'dev');
}

/**
 * Get database configuration
 * @returns {*}
 */
function getDatabaseConfig(){
    return getConfig()[DATABASE];
}

// Exports
module.exports = {
    getConfig: getConfig,
    getPort: getPort,
    isVerbose: isVerbose,
    isDeveloperMode: isDeveloperMode,
    getDatabaseConfig: getDatabaseConfig
};