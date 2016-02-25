/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 10/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.new')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.actions.new', {
                    url: '/new',
                    views: {
                        'content@ozra': {
                            templateUrl: 'ozra/actions/new/new.html',
                            controller: 'ActionsAddController',
                            controllerAs: 'actionsAddCtrl'
                        }
                    }
                });
        }

})();
