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
        }
    }
    /* jshint ignore:end */
};

// design object
var design = {
    designDocument: userDesign,
    query: {
        getAll: 'users/getAll',
        getFromToken: 'users/getFromToken'
    }
};

exports.design = design;
exports.type = type;

