/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */

//Require
var promise = require('promise');
var pouchDB = require('pouchdb');
var _ = require('lodash');
var config = require('../shared/configuration.js');
var security = require('../base/security.js');

// Models
var userModel = require('../models/user.js');
var groupModel = require('../models/group.js');
var actionModel = require('../models/action.js');

// Database variable
var dbName = config.getDatabaseConfig();
var db = new pouchDB(dbName);
var dbOptions = {'include_docs': true};


// Exports
module.exports = {
    // Init
    initDatabase: initDatabase,
    // Update
    updateDesignDocument: updateDesignDocument,
    // User
    getAllUsers: getAllUsers,
    getUserFromName: getUserFromName,
    getUserFromToken: getUserFromToken,
    getUserFromId: getUserFromId,
    getUsersFromGroupId: getUsersFromGroupId,
    // Group
    getAllGroups: getAllGroups,
    getGroupFromId: getGroupFromId,
    getGroupFromName: getGroupFromName,
    getGroupsFromIds: getGroupsFromIds,
    // Action
    getAllActions: getAllActions,
    getActionFromId: getActionFromId,
    // Put
    put: put,
    // Delete
    remove: remove
};


// Functions

/**
 * Init database
 * @returns {promise}
 */
function initDatabase(){
    return new promise(function(resolve, reject){
        // Init documents
        var group = new groupModel.Group()
            .setName('Administrator')
            .setAdministrator(true);
        var salt = security.genSaltSync();
        var user = new userModel.User()
            .setName('admin')
            .setPassword(security.genHashSync('admin', salt))
            .setSalt(salt)
            .setToken(security.genTokenSync())
            .addGroup(group.getId());


        db.allDocs().then(function(result){
            if (result['total_rows'] >= 5){
                // Initialized
                resolve();
            }
            else {
                // Need initialization
                db.destroy().then(function(){
                    // Create new database
                    db = new pouchDB(dbName);
                    // Array to store functions
                    var promises = [];
                    // Create and store functions : designs
                    promises.push(new promise(function(resolve, reject){
                        db.put(userModel.design.designDocument).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(actionModel.design.designDocument).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(groupModel.design.designDocument).then(resolve).catch(reject);
                    }));
                    // Create and store functions : documents
                    promises.push(new promise(function(resolve, reject){
                        db.put(group.toJson()).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(user.toJson()).then(resolve).catch(reject);
                    }));
                    // Launch functions
                    promise.all(promises).then(resolve,reject);
                }, reject);
            }
        }, reject);
    });
}

/**
 * Update design document
 * @warning Use this function when init database is finished
 * @returns {promise}
 */
function updateDesignDocument(){
    return new promise(function(resolve, reject){
        // Here: assume that every design document are integrated
        var promises = [];
        // Get all design documents
        // User design
        promises.push(new promise(function(resolve, reject){
            db.get(userModel.design.designDocument._id).then(function(document){
                var designDoc = userModel.design.designDocument;
                // Check version
                if (designDoc.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    designDoc._rev = document._rev;
                    // Update in db
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    var designDoc = userModel.design.designDocument;
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));
        // Group design
        promises.push(new promise(function(resolve, reject){
            db.get(groupModel.design.designDocument._id).then(function(document){
                var designDoc = groupModel.design.designDocument;
                // Check version
                if (designDoc.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    designDoc._rev = document._rev;
                    // Update in db
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    var designDoc = groupModel.design.designDocument;
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));
        // Action design
        promises.push(new promise(function(resolve, reject){
            db.get(actionModel.design.designDocument._id).then(function(document){
                var designDoc = actionModel.design.designDocument;
                // Check version
                if (designDoc.version !== document.version){
                    // Need update

                    // Update rev to update easily
                    designDoc._rev = document._rev;
                    // Update in db
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Update at good version
                    resolve();
                }
            }).catch(function(err){
                if (err.status === 404){
                    // Not found => put it in place
                    var designDoc = actionModel.design.designDocument;
                    db.put(designDoc).then(resolve).catch(reject);
                }
                else {
                    // Error
                    reject();
                }
            });
        }));

        promise.all(promises).then(resolve, reject);
    });
}

/**
 * Get all users
 * @returns {promise}
 */
function getAllUsers(){
    return new promise(function(resolve, reject){
        db.query(userModel.design.query.getAll, dbOptions).then(function(results){
            var rows = results.rows;
            var usersDocuments = [];

            _.forEach(rows, function(user){
                usersDocuments.push(new userModel.User().clone(user.doc));
            });

            // Resolve
            resolve(usersDocuments);
        }).catch(reject);
    });
}

/**
 * Get user from name
 * @param name {string} user name
 * @returns {promise}
 */
function getUserFromName(name){
    return new promise(function(resolve, reject){
        db.query(userModel.design.query.getFromName, dbOptions).then(function(results){
            var rows = results.rows;

            // Get user from token
            var i;
            for (i = 0; i < rows.length; i++){
                if (rows[i].key === name){
                    resolve(new userModel.User().clone(rows[i].doc));
                    return; // Stop here
                }
            }

            // Error
            reject();
        }).catch(reject);
    });
}

/**
 * Get user from token
 * @param token {string} token
 * @returns {promise}
 */
function getUserFromToken(token){
    return new promise(function(resolve, reject){
        db.query(userModel.design.query.getFromToken, dbOptions).then(function(results){
            var rows = results.rows;

            // Get user from token
            var i;
            for (i = 0; i < rows.length; i++){
                if (rows[i].key === token){
                    resolve(new userModel.User().clone(rows[i].doc));
                    return; // Stop here
                }
            }

            // Error
            reject();
        }).catch(reject);
    });
}

/**
 * Get user from id
 * @param id {string}
 * @returns {promise}
 */
function getUserFromId(id){
    return new promise(function(resolve, reject){
        db.get(id).then(function(document){
            if (document.type !== userModel.type){
                // Not a user document
                reject();
                return;
            }

            // User document
            resolve(new userModel.User().clone(document));
        }).catch(reject);
    });
}

/**
 * Get users from group id
 * @param groupId {string}
 * @returns {promise}
 */
function getUsersFromGroupId(groupId){
    return new promise(function(resolve, reject){
        db.query(userModel.design.query.getFromGroup, dbOptions).then(function(results){
            var rows = results.rows;
            var users = [];

            _.forEach(rows, function(row){
                // key : group id
                // value : user id
                // doc : user document
                if (row.key === groupId){
                    users.push(new userModel.User().clone(row.doc));
                }
            });

            resolve(users);
        }).catch(reject);
    });
}

/**
 * Get all groups
 * @returns {promise}
 */
function getAllGroups(){
    return new promise(function(resolve, reject){
        db.query(groupModel.design.query.getAll, dbOptions).then(function(results){
            var rows = results.rows;
            var documents = [];

            _.forEach(rows, function(group){
                documents.push(new groupModel.Group().clone(group.doc));
            });

            // Resolve
            resolve(documents);
        }).catch(reject);
    });
}

/**
 * Get group from id
 * @param id {string}
 * @returns {promise}
 */
function getGroupFromId(id){
    return new promise(function(resolve, reject){
        db.get(id).then(function(document){
            if (document.type !== groupModel.type){
                // Not a group => error
                reject();
                return;
            }

            // Group document
            resolve(new groupModel.Group().clone(document));
        }).catch(reject);
    });
}

/**
 * Get Group from name
 * @param name
 * @returns {promise}
 */
function getGroupFromName(name){
    return new promise(function(resolve, reject){
        db.query(groupModel.design.query.getFromName, dbOptions).then(function(result){
            var rows = result.rows;

            // Get group from name
            var i;
            for (i = 0; i < rows.length; i++){
                if (rows[i].key === name){
                    resolve(new groupModel.Group().clone(rows[i].doc));
                    return; // Found => stop
                }
            }

            // Not found
            reject();
        }).catch(reject);
    });
}

/**
 * Get groups from ids
 * @param ids {Array} group ids
 * @returns {promise}
 */
function getGroupsFromIds(ids){
    return new promise(function(resolve, reject){
        var promises = [];

        _.forEach(ids, function(id){
            promises.push(getGroupFromId(id));
        });

        promise.all(promises).then(resolve, reject);
    });
}

/**
 * Get all actions
 * @returns {promise}
 */
function getAllActions(){
    return new promise(function(resolve, reject){
        db.query(actionModel.design.query.getAll, dbOptions).then(function(results){
            var rows = results.rows;

            var actions = [];
            _.forEach(rows, function(row){
                actions.push(new actionModel.Action().clone(row.doc));
            });

            resolve(actions);
        }).catch(reject);
    });
}

/**
 * Get action from id
 * @param id {string} action id
 * @returns {promise}
 */
function getActionFromId(id){
    return new promise(function(resolve, reject){
        db.get(id).then(function(document){
            if (document.type !== actionModel.type){
                // Not an action document
                reject();
                return;
            }

            // Action document
            resolve(new actionModel.Action().clone(document));
        }).catch(reject);
    });
}

/**
 * Put document in database
 * @param document {object} document
 * @returns {promise}
 */
function put(document){
    return new promise(function(resolve,reject){
        // Put document in db
        db.put(document).then(resolve).catch(reject);
    });
}

/**
 * Remove a document in db
 * @param document {object} document to remove
 * @returns {promise}
 */
function remove(document){
    return new promise(function(resolve, reject){
        db.remove(document).then(resolve).catch(reject);
    });
}




