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
    function userService($q, userDaoService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;
        
        // Public
        self.getCurrentFromId = getCurrentFromId;

        ////////////////

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



