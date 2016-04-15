/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var PouchDB = require('pouchdb');
var _ = require('lodash');
var config = require('../shared/configuration.js');

// Dao
var groupDaoService = require('../dao/groupDaoService.js');
var userDaoService = require('../dao/userDaoService.js');
var actionDaoService = require('../dao/actionDaoService.js');

// Wrappers
var securityWrapperService = require('../wrappers/securityWrapperService.js');

// Database variable
var db = new PouchDB(config.getDatabaseConfig());


/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    launch: launch
};


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */

/**
 * Check if database need to be initialize
 * @returns {Promise}
 */
function checkDatabaseNeedInit(){
    return new Promise(function(resolve, reject){
        db.allDocs().then(function(result) {
            if (result['total_rows'] >= 5) {
                // Initialized
                reject();
            }
            else {
                resolve();
            }
        });
    });
}

/**
 * Init database
 * @returns {Promise}
 */
function initDatabase(){
    return new Promise(function(resolve, reject){
        // Init documents
        var group = groupDaoService.createGroupFromData({
            name:'Administrator',
            administrator: true
        });
        var salt = securityWrapperService.genSaltSync();
        var user = userDaoService.createUserFromData({
            name: 'admin',
            password: securityWrapperService.genHashSync('admin', salt),
            salt: salt,
            token: securityWrapperService.genTokenSync(),
            groups: [
                group.getId()
            ]
        });


        // Need initialization
        db.destroy().then(function(){
            // Create new database
            db = new PouchDB(config.getDatabaseConfig());
            // Array to store functions
            var promises = [];
            // Create and store functions : designs
            promises.push(new Promise(function(resolve, reject){
                db.put(userDaoService.getDesignDocumentSync()).then(resolve).catch(reject);
            }));
            promises.push(new Promise(function(resolve, reject){
                db.put(actionDaoService.getDesignDocumentSync()).then(resolve).catch(reject);
            }));
            promises.push(new Promise(function(resolve, reject){
                db.put(groupDaoService.getDesignDocumentSync()).then(resolve).catch(reject);
            }));
            // Create and store functions : documents
            promises.push(new Promise(function(resolve, reject){
                db.put(group.toJson()).then(resolve).catch(reject);
            }));
            promises.push(new Promise(function(resolve, reject){
                db.put(user.toJson()).then(resolve).catch(reject);
            }));
            // Launch functions
            Promise.all(promises).then(resolve,reject);
        }, reject);
    });
}

/**
 * Update design document
 * @warning Use this function when init database is finished
 * @returns {Promise}
 */
function updateDesignDocument(){
    return new Promise(function(resolve, reject){
        // Here: assume that every design document are integrated
        var promises = [];
        // Get all design documents
        // User design
        var userDesignDocument = userDaoService.getDesignDocumentSync();
        promises.push(new Promise(function(resolve, reject){
            db.get(userDesignDocument._id).then(function(document){
                // Check version
                if (userDesignDocument.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    userDesignDocument._rev = document._rev;
                    // Update in db
                    db.put(userDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    db.put(userDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));

        // Group design
        var groupDesignDocument = groupDaoService.getDesignDocumentSync();
        promises.push(new Promise(function(resolve, reject){
            db.get(groupDesignDocument._id).then(function(document){
                // Check version
                if (groupDesignDocument.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    groupDesignDocument._rev = document._rev;
                    // Update in db
                    db.put(groupDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    db.put(groupDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));

        // Action design
        var actionDesignDocument = actionDaoService.getDesignDocumentSync();
        promises.push(new Promise(function(resolve, reject){
            db.get(actionDesignDocument._id).then(function(document){
                // Check version
                if (actionDesignDocument.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    actionDesignDocument._rev = document._rev;
                    // Update in db
                    db.put(actionDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    db.put(actionDesignDocument).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));

        Promise.all(promises).then(resolve, reject);
    });
}

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Launch init service
 * @returns {Promise}
 */
function launch(){
    return new Promise(function(resolve, reject){
        // Check if database need to be initialized
        checkDatabaseNeedInit().then(function(){
            // Need to be initialized
            initDatabase().then(resolve, reject);
        }, function(){
            // Need to be updated
            updateDesignDocument().then(resolve, reject);
        });
    });
}


