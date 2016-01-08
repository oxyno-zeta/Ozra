/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 04/12/15
 * Licence: See Readme
 */

// Type
var type = 'group';

// Design document
/* istanbul ignore next */
var groupDesign = {
    _id: '_design/groups',
    version: '0.0.3',
    /* jshint ignore:start */
    views: {
        getAll: {
            map: function(doc){
                if (doc.type === "group"){
                    emit(doc._id, doc.name);
                }
            }.toString()
        },
        getFromName: {
            map: function(doc){
                if (doc.type === "group"){
                    emit(doc.name, doc._id);
                }
            }.toString()
        }
    }
    /* jshint ignore:end */
};

var design = {
    designDocument: groupDesign,
    query: {
        getAll: 'groups/getAll',
        getFromName: 'groups/getFromName'
    }

};

exports.design = design;
exports.type = type;



