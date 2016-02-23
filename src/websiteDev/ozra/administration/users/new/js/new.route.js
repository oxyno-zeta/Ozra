/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 22/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.new')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration.users.new', {
                    url: '/new',
                    views: {
                        'content@ozra.administration': {
                            templateUrl: 'ozra/administration/users/new/new.html',
                            controller: 'UserNewAdminController',
                            controllerAs: 'userNewAdminCtrl'
                        }
                    },
                    resolve: {
                        allGroups: function(groupService){
                            return groupService.getAll();
                        }
                    }
                });
        }

})();