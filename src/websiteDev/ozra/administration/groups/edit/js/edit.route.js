/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 21/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups.edit')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig ($stateProvider) {
        $stateProvider
            .state('ozra.administration.groups.edit', {
                url: '/edit/:id',
                views: {
                    'content@ozra.administration': {
                        templateUrl: 'ozra/administration/groups/edit/edit.html',
                        controller: 'GroupEditAdminController',
                        controllerAs: 'groupEditAdminCtrl'
                    }
                },
                resolve: {
                    group: function($stateParams, groupService){
                        return groupService.getSpecificById($stateParams.id);
                    }
                }
            });
    }

})();