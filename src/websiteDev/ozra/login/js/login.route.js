/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.login')
        .config(routeConfig);

    /**@ngInject */
    function routeConfig ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                views: {
                    content: {
                        templateUrl: 'ozra/login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'loginCtrl'
                    }
                }
            });
    }

})();
