/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 01/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
var PouchDB = require('pouchdb');
var _ = require('lodash');
var config = require('../shared/configuration.js');

// Models
var userModel = require('../models/user.js');

// Database variable
var db = new PouchDB(config.getDatabaseConfig());
var dbOptions = {'include_docs': true};


/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    getDesignDocumentSync: getDesignDocumentSync,
    createUserFromData: createUserFromData,
    getAllUsers: getAllUsers,
    getUserFromName: getUserFromName,
    getUserFromToken: getUserFromToken,
    getUserFromId: getUserFromId,
    getUsersFromGroupId: getUsersFromGroupId,
    putUser: putUser,
    deleteUser: deleteUser
};


/* ************************************* */
/* ********  PRIVATE FUNCTIONS  ******** */
/* ************************************* */



/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */

/**
 * Get design document
 * @return design document
 */
function getDesignDocumentSync(){
    return userModel.design.designDocument;
}

/**
 * Create user from data
 * @param data
 * @returns {userModel}
 */
function createUserFromData(data){
    var user = userModel.User();
    // Set data
    user.setName(data.name)
        .setPassword(data.password)
        .setGroups(data.groups)
        .setSalt(data.salt)
        .setToken(data.token);
    return user;
}

/**
 * Get all users
 * @returns {Promise}
 */
function getAllUsers(){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getUserFromName(name){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getUserFromToken(token){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getUserFromId(id){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getUsersFromGroupId(groupId){
    return new Promise(function(resolve, reject){
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
 * Put user in database
 * @param user
 * @returns {Promise}
 */
function putUser(user){
    return new Promise(function(resolve, reject){
        // Put document in db
        db.put(user).then(resolve).catch(reject);
    });
}

/**
 * Delete user in database
 * @param user
 * @returns {*|exports|module.exports}
 */
function deleteUser(user){
    return new Promise(function(resolve, reject){
        db.remove(user).then(resolve).catch(reject);
    });
}
