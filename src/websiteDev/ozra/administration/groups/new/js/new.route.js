/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 21/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.new')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration.groups.new', {
                    url: '/new',
                    views: {
                        'content@ozra.administration': {
                            templateUrl: 'ozra/administration/groups/new/new.html',
                            controller: 'GroupNewAdminController',
                            controllerAs: 'groupNewAdminCtrl'
                        }
                    }
                });
        }

})();