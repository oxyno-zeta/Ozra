/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 15/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.parameters.password')
        .controller('PasswordUserController', PasswordUserController);

    /** @ngInject */
    function PasswordUserController($mdToast, $state, userService, currentUser) {
        var vm = this;
        // Variables
        vm.password = '';
        vm.checkPassword = '';
        vm.passwordNotOk = true;
        // Functions
        vm.checkIsPasswordNotOk = checkIsPasswordNotOk;
        vm.updateUserPassword = updateUserPassword;

        ////////////////

        function updateUserPassword(){
            var user = _.cloneDeep(currentUser);
            // Put data
            user.password = vm.password;
            userService.updateUserPassword(user).then(function(){
                // Password updated

                // Create toast
                var toast = $mdToast.simple()
                    .textContent('User password update succeed !')
                    .position('top right')
                    .hideDelay(1500);

                // Show toast
                $mdToast.show(toast);

                // Reload
                $state.go('ozra.parameters.general');
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('User password update failed !')
                    .position('top right')
                    .hideDelay(1500);

                // Show toast
                $mdToast.show(toast);
            });
        }

        /**
         * Check if password is not ok
         */
        function checkIsPasswordNotOk(){
            var result = false; // Default is ok

            if (_.isEqual(vm.password, '') ||
                _.isEqual(vm.checkPassword, '') ||
                !_.isEqual(vm.password, vm.checkPassword)){
                result = true;
            }

            // Put data
            vm.passwordNotOk = result;
        }
    }

})();

