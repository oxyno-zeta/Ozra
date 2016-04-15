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
var actionModel = require('../models/action.js');

// Database variable
var db = new PouchDB(config.getDatabaseConfig());
var dbOptions = {'include_docs': true};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
module.exports = {
    getDesignDocumentSync: getDesignDocumentSync,
    getAllActions: getAllActions,
    getActionFromId: getActionFromId,
    getActionsFromGroupIds: getActionsFromGroupIds,
    getActionFromName: getActionFromName,
    getActionFromCategory: getActionFromCategory,
    putAction: putAction,
    deleteAction: deleteAction
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
    return actionModel.design.designDocument;
}

/**
 * Get all actions
 * @returns {Promise}
 */
function getAllActions(){
    return new Promise(function(resolve, reject){
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
 * @returns {Promise}
 */
function getActionFromId(id){
    return new Promise(function(resolve, reject){
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
 * Get Action from group Ids
 * @param groupIds {Array} group ids
 * @returns {Promise}
 */
function getActionsFromGroupIds(groupIds){
    return new Promise(function(resolve, reject){
        db.query(actionModel.design.query.getFromGroupId, dbOptions).then(function(results){
            var rows = results.rows;
            var groupObject = {};

            _.forEach(groupIds, function(id){
                groupObject[id] = id;
            });

            var actions = [];
            _.forEach(rows, function(row){
                if (groupObject.hasOwnProperty(row.key)) {
                    actions.push(new actionModel.Action().clone(row.doc));
                }
            });

            resolve(actions);
        }).catch(reject);
    });
}

/**
 * Get Action from name
 * @param name
 * @returns {Promise}
 */
function getActionFromName(name){
    return new Promise(function(resolve, reject){
        // Query database
        db.query(actionModel.design.query.getFromName, dbOptions).then(function(result){
            var rows = result.rows;

            // Get group from name
            var i;
            for (i = 0; i < rows.length; i++){
                if (rows[i].key === name){
                    resolve(new actionModel.Action().clone(rows[i].doc));
                    return; // Found => stop
                }
            }

            // Not found
            reject();
        }).catch(reject);
    });
}

/**
 * Get Action From Category
 * @param name
 * @param category
 * @returns {Promise}
 */
function getActionFromCategory(name, category){
    return new Promise(function(resolve, reject){
        db.query(actionModel.design.query.getFromCategoryName, dbOptions).then(function(result){
            var rows = result.rows;

            // Get category
            var rowsResult = _.filter(rows, function(row){
                return (_.isEqual(row.doc.category, category) && _.isEqual(row.doc.name, name));
            });

            if (_.isEqual(rowsResult.length, 0)){
                reject();
                return;
            }

            resolve(new actionModel.Action().clone(rowsResult[0].doc));
        }).catch(reject);
    });
}

/**
 * Put action in database
 * @param action
 * @returns {*|exports|module.exports}
 */
function putAction(action){
    return new Promise(function(resolve, reject){
        // Put document in db
        db.put(action).then(resolve).catch(reject);
    });
}

/**
 * Delete action in database
 * @param action
 * @returns {*|exports|module.exports}
 */
function deleteAction(action){
    return new Promise(function(resolve, reject){
        db.remove(action).then(resolve).catch(reject);
    });
}
