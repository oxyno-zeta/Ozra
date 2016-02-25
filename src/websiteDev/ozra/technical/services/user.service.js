/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('userService', userService);

    /** @ngInject */
    function userService($q, userDaoService, groupDaoService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;
        
        // Public
        // Admin part
        self.getAll = getAll;
        self.createEmptyNew = createEmptyNew;
        self.addNewUser = addNewUser;
        self.getSpecificByIdAndPopulated = getSpecificByIdAndPopulated;
        self.updateUser = updateUser;
        self.deleteUser = deleteUser;
        // Normal part
        self.getCurrentFromId = getCurrentFromId;
        self.updateUserPassword = updateUserPassword;

        ////////////////

        /**
         * Delete user
         * @param user
         * @returns {*}
         */
        function deleteUser(user){
            var deferred = $q.defer();
            userDaoService.deleteUser(user).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Update user
         * @param user
         * @returns {*}
         */
        function updateUser(user){
            var deferred = $q.defer();
            userDaoService.updateUser(user).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get user by id
         * @param id
         * @returns {*}
         */
        function getSpecificByIdAndPopulated(id){
            var deferred = $q.defer();
            userDaoService.getFromId(id).then(function(user){
                var promises = [];
                _.forEach(user.groups, function(id){
                    promises.push(groupDaoService.getSpecificById(id));
                });

                // Wait for all
                $q.all(promises).then(function(groups){
                    // put data in place
                    user.groups = groups;
                    // Resolve
                    deferred.resolve(user);
                }, deferred.reject);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Add new user
         * @param user
         * @returns {*}
         */
        function addNewUser(user){
            var deferred = $q.defer();
            userDaoService.addNewUser(user).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Create empty user
         * @returns {*}
         */
        function createEmptyNew(){
            return userDaoService.createEmptyNew();
        }

        /**
         * Get All users (only for admin)
         * @returns {*}
         */
        function getAll(){
            var deferred = $q.defer();
            userDaoService.getAll().then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Change user password
         * @param userWithPassword
         * @returns {*}
         */
        function updateUserPassword(userWithPassword){
            var deferred = $q.defer();
            userDaoService.updateUserPassword(userWithPassword).then(deferred.resolve, deferred.reject);
            return deferred.promise;
        }

        /**
         * Get current user from id
         * @returns {*}
         */
        function getCurrentFromId() {
            var deferred = $q.defer();
            userDaoService.getFromId(dataCacheService.userId).then(function(user){
                dataCacheService.currentUser = user;
                deferred.resolve(user);
            }, deferred.reject);
            return deferred.promise;
        }
    }

})();



