/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 31/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.services')
        .service('groupDaoService', groupDaoService);

    /** @ngInject */
    function groupDaoService($q, requestService, groupModelFactory) {
        /* jshint validthis: true */
        var self = this;

        // Private
        var baseUrl = '/api/groups/';
        // Public
        self.getCurrentUserGroups = getCurrentUserGroups;

        ////////////////

        /**
         * Get all groups for the current user
         * @returns {*} All groups in a promise
         */
        function getCurrentUserGroups(){
            var deferred = $q.defer();
            var url = baseUrl + 'user/';

            // Create promise
            requestService.get(url).then(function(response){
                var groups = {};
                var group;
                _.forEach(response.groups, function (_group) {
                    group = groupModelFactory.getFromData(_group);
                    groups[group.id] = group;
                });

                deferred.resolve(groups);
            }, deferred.reject);

            return deferred.promise;
        }
    }

})();
