/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 10/02/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.dialogs.actionLogDialog')
        .controller('ActionLogDialog', ActionLogDialog);

    /** @ngInject */
    function ActionLogDialog($mdDialog, result) {
        console.log(result);
        var vm = this;
        // Variables
        vm.result = result;
        // Functions
        vm.isInError = isInError;
        vm.answer = answer;

        ////////////////

        /**
         * Check is log is in error
         * @returns {*}
         */
        function isInError(){
            return (!_.isEqual(result.code, 0));
        }

        /**
         * Answer the dialog
         */
        function answer(){
            $mdDialog.hide();
        }
    }

})();


