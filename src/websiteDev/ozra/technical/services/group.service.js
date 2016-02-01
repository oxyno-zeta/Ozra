/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('groupService', groupService);

    /** @ngInject */
    function groupService($q, groupDaoService, dataCacheService) {
        /* jshint validthis: true */
        var self = this;

        // Public
        self.getCurrentUserGroups = getCurrentUserGroups;
        self.isOneGroupAdministrator = isOneGroupAdministrator;

        ////////////////

        /**
         * Get all groups for the current user
         * @returns {*} All groups in a promise
         */
        function getCurrentUserGroups(){
            var deferred = $q.defer();
            // Create promise
            groupDaoService.getCurrentUserGroups().then(function(groups){
                dataCacheService.currentGroups = groups;
                deferred.resolve(groups);
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * Check if one group is administrator
         * @param groups {Array} groups
         * @returns {boolean}
         */
        function isOneGroupAdministrator(groups){
            var i;
            for (i = 0; i < groups.length; i++){
                if (groups[i].administrator){
                    return true;
                }
            }

            return false;
        }
    }

})();
