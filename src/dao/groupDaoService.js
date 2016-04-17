/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 03/04/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
// Require
var PouchDB = require('pouchdb');
var _ = require('lodash');
var config = require('../services/configurationService');

// Models
var groupModel = require('../models/group');

// Database variable
var db = new PouchDB(config.getDatabaseConfig());
var dbOptions = {'include_docs': true};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    getDesignDocumentSync: getDesignDocumentSync,
    createGroupFromData: createGroupFromData,
    getAllGroups: getAllGroups,
    getGroupFromId: getGroupFromId,
    getGroupFromName: getGroupFromName,
    getGroupsFromIds: getGroupsFromIds,
    putGroup: putGroup,
    deleteGroup: deleteGroup
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
    return groupModel.design.designDocument;
}

/**
 * Create group from data
 * @param data
 * @returns {groupModel}
 */
function createGroupFromData(data){
    var group = new groupModel.Group();
    // Set data
    group.setName(data.name)
        .setAdministrator(data.administrator);
    return group;
}

/**
 * Get all groups
 * @returns {Promise}
 */
function getAllGroups(){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getGroupFromId(id){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getGroupFromName(name){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getGroupsFromIds(ids){
    return new Promise(function(resolve, reject){
        var promises = [];

        _.forEach(ids, function(id){
            promises.push(getGroupFromId(id));
        });

        Promise.all(promises).then(resolve, reject);
    });
}

/**
 * Put group in database
 * @param group
 * @returns {Promise}
 */
function putGroup(group){
    return new Promise(function(resolve, reject){
        // Put document in db
        db.put(group).then(resolve).catch(reject);
    });
}

/**
 * Delete group in database
 * @param group
 * @returns {*|exports|module.exports}
 */
function deleteGroup(group){
    return new Promise(function(resolve, reject){
        db.remove(group).then(resolve).catch(reject);
    });
}
