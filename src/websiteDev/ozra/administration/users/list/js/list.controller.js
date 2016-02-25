/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 20/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.list')
        .controller('UsersListAdminController', UsersListAdminController);

    /** @ngInject */
    function UsersListAdminController(listUsers) {
        var vm = this;
        // Variables
        vm.listUsers = listUsers;

        ////////////////

    }

})();

