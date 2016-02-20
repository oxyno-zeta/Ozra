/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.administration.menu')
        .controller('AdministrationMenuController', AdministrationMenuController);

    /** @ngInject */
    function AdministrationMenuController($state) {
        var vm = this;
        // Variables
        // Functions
        vm.goToUsers = goToUsers;
        vm.isUsers = isUsers;

        ////////////////

        /**
         * Go to users page
         */
        function goToUsers() {
            $state.go('ozra.administration.users');
        }

        /**
         * Check if users button is ok
         * @returns {boolean}
         */
        function isUsers(){
            return $state.is('ozra.administration.users');
        }
    }

})();
