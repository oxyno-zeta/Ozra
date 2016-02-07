/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 02/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.actions.list')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.actions', {
                    url: '/ozra',
                    views: {
                        content: {
                            templateUrl: 'ozra/actions/list/list.html',
                            controller: 'ActionsListController',
                            controllerAs: 'actionsListCtrl'
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
