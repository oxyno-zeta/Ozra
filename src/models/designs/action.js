/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 05/12/15
 * Licence: See Readme
 */
// Type
var type = 'action';

// Document design
/* istanbul ignore next */
var actionDesign = {
    _id: '_design/actions',
    version: '0.0.2',
    /* jshint ignore:start */
    views: {
        getAll: {
            map: function(doc){
                if (doc.type === "action"){
                    emit(doc._id, doc.name);
                }
            }.toString()
        }
    }
    /* jshint ignore:end */
};

var design = {
    designDocument: actionDesign,
    query: {
        getAll: 'actions/getAll'
    }
};

exports.design = design;
exports.type = type;