/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/01/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.technical.model')
        .service('userModelFactory', userModelFactory);

    /* @ngInject */
    function userModelFactory() {
        /* jshint validthis: true */
        var self = this;

        // Export
        self.getFromData = getFromData;
        self.createEmptyNew = createEmptyNew;

        ////////////////

        /**
         * User model
         * @constructor
         * @returns {UserModel}
         */
        function UserModel(data) {
            // Model
            /* jshint validthis: true */
            var model = this;
            // Base
            if (_.isUndefined(data)) {
                model.id = undefined;
                model.name = undefined;
                model.password = undefined;
                model.token = undefined;
                model.groups = [];
            }
            else {
                model.id = data.id;
                model.name = data.name;
                model.password = undefined;
                model.token = data.token;
                model.groups = data.groups;
            }
        }

        /**
         * Create User from data
         * @param data
         * @returns {userModelFactory.UserModel}
         */
        function getFromData(data) {
            return new UserModel(data);
        }

        /**
         * Create empty user
         * @returns {userModelFactory.UserModel}
         */
        function createEmptyNew(){
            return new UserModel();
        }
    }

})();


