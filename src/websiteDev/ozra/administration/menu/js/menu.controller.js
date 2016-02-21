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
        vm.goToGroups = goToGroups;
        vm.isGroups = isGroups;

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

        /**
         * Go to groups page
         */
        function goToGroups() {
            $state.go('ozra.administration.groups');
        }

        /**
         * Check if groups button is ok
         * @returns {boolean}
         */
        function isGroups(){
            return $state.is('ozra.administration.groups');
        }
    }

})();
