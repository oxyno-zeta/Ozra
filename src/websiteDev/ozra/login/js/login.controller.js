/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($mdToast, $state, systemService) {
        var vm = this;
        // Variables
        vm.username = '';
        vm.password = '';
        // Functions
        vm.isDisabled = isDisabled;
        vm.submit = submit;

        ////////////////

        /**
         * Check if login is disabled
         * @returns {boolean}
         */
        function isDisabled(){
            if (_.isNull(vm.username) ||
                _.isUndefined(vm.username) ||
                !_.isString(vm.username) ||
                _.isEqual(vm.username, '')){
                return true;
            }

            if (_.isNull(vm.password) ||
                _.isUndefined(vm.password) ||
                !_.isString(vm.password) ||
                _.isEqual(vm.password, '')){
                return true;
            }

            return false;
        }

        function submit(){
            systemService.login(vm.username, vm.password).then(function(result){
                $state.go('ozra');
            }, function(err){
                if (_.isEqual(err.status, 401)){
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Authentication failed !')
                            .position('top right')
                            .hideDelay(1500)
                    );
                    return;
                }

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Something failed !')
                        .position('top right')
                        .hideDelay(1500)
                );
            });
        }
    }

})();


