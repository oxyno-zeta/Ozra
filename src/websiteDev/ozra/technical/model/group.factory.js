/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.model')
        .factory('groupModelFactory', groupModelFactory);

    /* @ngInject */
    function groupModelFactory() {
        var service = {
            getFromData: getFromData
        };
        return service;

        ////////////////

        /**
         * Group Model
         * @constructor
         * @returns {GroupModel}
         */
        function GroupModel(data) {
            /* jshint validthis: true */
            var model = this;

            // Base
            if (_.isUndefined(data)) {
                model.id = undefined;
                model.rev = undefined;
                model.name = undefined;
                model.administrator = false;
            }
            else {
                model.id = data._id;
                model.rev = data._rev;
                model.name = data.name;
                model.administrator = data.administrator;
            }
        }

        /**
         * Create group from data
         * @param data
         * @returns {groupModelFactory.GroupModel}
         */
        function getFromData(data) {
            return new GroupModel(data);
        }
    }

})();


