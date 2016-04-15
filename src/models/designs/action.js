/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */

/* ************************************* */
/* ********   PUBLIC FUNCTIONS  ******** */
/* ************************************* */
// Type
var type = 'action';

// Document design
/* istanbul ignore next */
var actionDesign = {
    _id: '_design/actions',
    version: '0.0.3',
    /* jshint ignore:start */
    views: {
        getAll: {
            map: function(doc){
                if (doc.type === "action"){
                    emit(doc._id, doc.name);
                }
            }.toString()
        },
        getFromGroupId: {
            map: function(doc){
                if (doc.type === "action"){
                    doc.groups.forEach(function(groupId){
                        emit(groupId, doc._id);
                    });
                }
            }.toString()
        },
        getFromName: {
            map: function(doc){
                if (doc.type === "action"){
                    emit(doc.name, doc._id);
                }
            }.toString()
        },
        getFromCategoryName: {
            map: function(doc){
                if (doc.type === "action"){
                    emit(doc.category, doc.name);
                }
            }.toString()
        }
    }
    /* jshint ignore:end */
};

var design = {
    designDocument: actionDesign,
    query: {
        getAll: 'actions/getAll',
        getFromGroupId: 'actions/getFromGroupId',
        getFromName: 'actions/getFromName',
        getFromCategoryName: 'actions/getFromCategoryName'
    }
};

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
exports.design = design;
exports.type = type;