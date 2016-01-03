/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/01/16
 * Licence: See Readme
 */

// Require
var os = require('os');
var osUtils = require('os-utils');
var _ = require('lodash');
var promise = require('promise');


// Exports
module.exports = {
    getArchitecture: getArch,
    getCpus: getCpus,
    getCpuUsage: getCpuUsage,
    getCpuFree: getCpuFree,
    getCpuCount: getCpuCount,
    getFreeMemory: getFreeMemory,
    getFreeMemoryPercentage: getFreeMemoryPercentage,
    getTotalMemory: getTotalMemory,
    getHomeDir: getHomeDir,
    getTmpDir: getTmpDir,
    getHardDriveInformation: getHardDrive,
    getLoadAvg: getLoadAvg,
    getNetworkInterfaces: getNetworkInterfaces,
    getPlatform: getPlatform,
    getType: getType,
    isWindowsSync: isWindowsSync
};

/**
 * Get Architecture
 * @returns {promise}
 */
function getArch(){
    return new promise(function(resolve, reject){
        resolve(os.arch());
    });
}

/**
 * Get CPUs
 * @returns {promise}
 */
function getCpus(){
    return new promise(function(resolve, reject){
        resolve(os.cpus());
    });
}

/**
 * Get Cpu usage in percentage
 * @returns {promise}
 */
function getCpuUsage(){
    return new promise(function(resolve, reject){
        osUtils.cpuUsage(resolve);
    });
}

/**
 * Get Free Cpu in percentage
 * @returns {promise}
 */
function getCpuFree(){
    return new promise(function(resolve, reject){
        osUtils.cpuFree(resolve);
    });
}

/**
 * Get Cpu Count
 * @returns {promise}
 */
function getCpuCount(){
    return new promise(function(resolve, reject){
        resolve(osUtils.cpuCount());
    });
}

/**
 * Get Free Memory
 * @returns {promise}
 */
function getFreeMemory(){
    return new promise(function(resolve, reject){
        resolve(os.freemem());
    });
}

/**
 * Get Free Memory in percentage
 * @returns {promise}
 */
function getFreeMemoryPercentage(){
    return new promise(function(resolve, reject){
        resolve(osUtils.freememPercentage());
    });
}

/**
 * Get total memory
 * @returns {promise}
 */
function getTotalMemory(){
    return new promise(function(resolve, reject){
        resolve(os.totalmem());
    });
}

/**
 * Get Home Directory
 * @returns {promise}
 */
function getHomeDir(){
    return new promise(function(resolve, reject){
        resolve(os.homedir());
    });
}

/**
 * Get Tmp directory
 * @returns {promise}
 */
function getTmpDir(){
    return new promise(function(resolve, reject){
        resolve(os.tmpdir());
    });
}

/**
 * Get Host Name
 * @returns {promise}
 */
function getHostname(){
    return new promise(function(resolve, reject){
        resolve(os.hostname());
    });
}

/**
 * Get Hard Drive information
 * @returns {promise}
 */
function getHardDrive(){
    return new promise(function(resolve, reject){
        osUtils.harddrive(resolve);
    });
}

/**
 * Get Load Average (1, 5, 15 minutes in array)
 * @returns {promise}
 */
function getLoadAvg(){
    return new promise(function(resolve, reject){
        resolve(os.loadavg());
    });
}

/**
 * Get Network Interfaces
 * @returns {promise}
 */
function getNetworkInterfaces(){
    return new promise(function(resolve, reject){
        resolve(os.networkInterfaces());
    });
}

/**
 * Get System Platform
 * @returns {promise}
 */
function getPlatform(){
    return new promise(function(resolve, reject){
        resolve(os.platform());
    });
}

/**
 * Get Release
 * @returns {promise}
 */
function getRelease(){
    return new promise(function(resolve, reject){
        resolve(os.release());
    });
}

/**
 * Get OS Type
 * @returns {promise}
 */
function getType(){
    return new promise(function(resolve, reject){
        resolve(os.type());
    });
}

/**
 * Check is operating system is Windows synchronously
 * @returns {*}
 */
function isWindowsSync(){
    return _.isEqual(os.type(), 'Windows_NT');
}

/**
 * Get system uptime
 * @returns {promise}
 */
function systemUptime(){
    return new promise(function(resolve, reject){
        resolve(os.uptime());
    });
}


