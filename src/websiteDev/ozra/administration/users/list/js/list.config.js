/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.list')
        .config(routeConfig);

        /* @ngInject */
        function routeConfig ($stateProvider) {
            $stateProvider
                .state('ozra.administration.users', {
                    url: '/users',
                    views: {
                        'content@ozra.administration': {
                            templateUrl: 'ozra/administration/users/list/list.html',
                            controller: 'UsersListAdminController',
                            controllerAs: 'usersListAdminCtrl'
                        }
                    },
                    resolve: {
                        listUsers: function (userService){
                            return userService.getAll();
                        }
                    }
                });
        }

})();
