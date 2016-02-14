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
    }

})();
