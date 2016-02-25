/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 14/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.parameters.menu')
        .controller('ParametersMenuController', ParametersMenuController);

    /** @ngInject */
    function ParametersMenuController($state) {
        var vm = this;
        // Variables
        // Functions
        vm.goToGeneral = goToGeneral;
        vm.isGeneral = isGeneral;
        vm.goToPassword = goToPassword;
        vm.isPassword = isPassword;

        ////////////////

        /**
         * Go to general page
         */
        function goToGeneral() {
            $state.go('ozra.parameters.general');
        }

        /**
         * Check if general button is ok
         * @returns {boolean}
         */
        function isGeneral(){
            return $state.is('ozra.parameters.general');
        }

        /**
         * Go to change password page
         */
        function goToPassword() {
            $state.go('ozra.parameters.password');
        }

        /**
         * Check if password change button is ok
         * @returns {boolean}
         */
        function isPassword(){
            return $state.is('ozra.parameters.password');
        }
    }

})();
