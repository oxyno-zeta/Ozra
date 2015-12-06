/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */

//Require
var promise = require('promise');
var pouchDB = require('pouchdb');
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
    // User
    getAllUsers: getAllUsers,
    getUserFromToken: getUserFromToken,
    getUserFromId: getUserFromId,
    getUsersFromGroupId: getUsersFromGroupId,
    // Group
    getAllGroups: getAllGroups,
    getGroupFromId: getGroupFromId,
    getGroupsFromIds: getGroupsFromIds,
    // Action
    getAllActions: getAllActions,
    getActionFromId: getActionFromId
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
        var group2 = new groupModel.Group()
            .setName('test')
            .setAdministrator(false);
        var salt = security.genSaltSync();
        var user = new userModel.User()
            .setName('admin')
            .setPassword(security.genHashSync('admin', salt))
            .setSalt(salt)
            .setToken(security.genTokenSync())
            .addGroup(group.getId())
            .addGroup(group2.getId());
        var user2 = new userModel.User()
            .setName('testUser')
            .setPassword(security.genHashSync('admin', salt))
            .setSalt(salt)
            .setToken(security.genTokenSync())
            .addGroup(group2.getId());
        var action = new actionModel.Action()
            .setName('uuu')
            .setCategory('category')
            .setScript('');


        db.allDocs().then(function(result){
            if (result['total_rows'] >= 4){
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
                        db.put(group2.toJson()).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(user.toJson()).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(user2.toJson()).then(resolve).catch(reject);
                    }));
                    promises.push(new promise(function(resolve, reject){
                        db.put(action.toJson()).then(resolve).catch(reject);
                    }));
                    // Launch functions
                    promise.all(promises).then(resolve,reject);
                }, reject);
            }
        }, reject);
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

            rows.forEach(function(user){
                usersDocuments.push(new userModel.User().clone(user.doc));
            });

            // Resolve
            resolve(usersDocuments);
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
            var usersStorage = {};

            rows.forEach(function(row){
                // key : group id
                // value : user id
                // doc : user document
                if (row.key === groupId){
                    usersStorage[row.value] = row.doc;
                }
            });

            var users = [];
            var key;
            for (key in usersStorage){
                if (usersStorage.hasOwnProperty(key)){
                    users.push(new userModel.User().clone(usersStorage[key]));
                }
            }

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

            rows.forEach(function(group){
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
 * Get groups from ids
 * @param ids {Array} group ids
 * @returns {promise}
 */
function getGroupsFromIds(ids){
    return new promise(function(resolve, reject){
        var promises = [];

        ids.forEach(function(id){
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
            rows.forEach(function(row){
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








