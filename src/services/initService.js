/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var PouchDB = require('pouchdb');
var configurationService = require('../services/configurationService');

// Dao
var groupDaoService = require('../dao/groupDaoService');
var userDaoService = require('../dao/userDaoService');
var actionDaoService = require('../dao/actionDaoService');

// Wrappers
var securityWrapperService = require('../wrappers/securityWrapperService');

// Database variable
var db = new PouchDB(configurationService.getDatabaseConfig());


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

        var promises = [];
        promises.push(securityWrapperService.genSalt());
        promises.push(securityWrapperService.genToken());

        Promise.all(promises).then(function(results){
            var salt = results[0];
            var token = results[1];

            securityWrapperService.genHash('admin', salt).then(function(encryptedPassword){
                var user = userDaoService.createUserFromData({
                    name: 'admin',
                    password: encryptedPassword,
                    salt: salt,
                    token: token,
                    groups: [
                        group.getId()
                    ]
                });

                // Need initialization
                db.destroy().then(function(){
                    // Create new database
                    db = new PouchDB(configurationService.getDatabaseConfig());
                    // Array to store functions
                    promises = [];
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

            }, reject);
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


