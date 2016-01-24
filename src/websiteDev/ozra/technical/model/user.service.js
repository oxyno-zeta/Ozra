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
                model.rev = undefined;
                model.name = undefined;
                model.password = undefined;
                model.salt = undefined;
                model.token = undefined;
                model.groups = [];
            }
            else {
                model.id = data._id;
                model.rev = data._rev;
                model.name = data.name;
                model.password = data.password;
                model.salt = data.salt;
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
    }

})();

