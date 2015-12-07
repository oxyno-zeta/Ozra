/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */
// Type
var type = 'user';

// Design document
/* istanbul ignore next */
var userDesign = {
    _id: '_design/users',
    version: '0.0.1',
    /* jshint ignore:start */
    views: {
        getAll: {
            map: function(doc){
                if (doc.type === "user"){
                    emit(doc._id, doc.name);
                }
            }.toString()
        },
        getFromToken: {
            map: function(doc){
                if (doc.type === "user"){
                    emit(doc.token, doc.name);
                }
            }.toString()
        },
        getFromGroup: {
            map: function(doc){
                if (doc.type === "user"){
                    doc.groups.forEach(function(groupId){
                        emit(groupId, doc._id);
                    });
                }
            }.toString()
        }
    }
    /* jshint ignore:end */
};

// design object
var design = {
    designDocument: userDesign,
    query: {
        getAll: 'users/getAll',
        getFromToken: 'users/getFromToken',
        getFromGroup: 'users/getFromGroup'
    }
};

exports.design = design;
exports.type = type;

