/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 22/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.edit')
        .config(routeConfig);

        /** @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration.users.edit', {
                    url: '/edit/:id',
                    views: {
                        'content@ozra.administration': {
                            templateUrl: 'ozra/administration/users/edit/edit.html',
                            controller: 'UserEditAdminController',
                            controllerAs: 'userEditAdminCtrl'
                        }
                    },
                    resolve: {
                        userPopulated: function($stateParams, userService){
                            return userService.getSpecificByIdAndPopulated($stateParams.id);
                        },
                        allGroups: function(groupService){
                            return groupService.getAll();
                        }
                    }
                });
        }

})();