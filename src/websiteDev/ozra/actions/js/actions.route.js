/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.actions', {
                    url: '/ozra',
                    views: {
                        content: {
                            templateUrl: 'ozra/actions/actions.html',
                            controller: 'ActionsController',
                            controllerAs: 'actionsCtrl'
                        }
                    },
                    resolve: {
                        actions: function(actionService){
                            return actionService.getAllActions();
                        }
                    }
                });
        }

})();
