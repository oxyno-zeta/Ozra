/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 20/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.list')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration.groups', {
                    url: '/groups',
                    views: {
                        'content@ozra.administration': {
                            templateUrl: 'ozra/administration/groups/list/list.html',
                            controller: 'GroupsListAdminController',
                            controllerAs: 'groupsListAdminCtrl'
                        }
                    },
                    resolve: {
                        listGroups: function(groupService){
                            return groupService.getAll();
                        }
                    }
                });
        }

})();