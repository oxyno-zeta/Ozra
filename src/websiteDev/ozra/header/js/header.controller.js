/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.header')
        .controller('HeaderController', HeaderController);

    /** @ngInject */
    function HeaderController($state, $mdDialog, dataCacheService, groupService, currentGroups) {
        var vm = this;
        // Variables
        vm.isAdmin = groupService.isOneGroupAdministrator(currentGroups);
        // Functions
        vm.disconnect = disconnect;

        ////////////////

        /**
         * Disconnect
         * @param event
         */
        function disconnect(event){
            // Confirm dialog creation
            var confirm = $mdDialog.confirm()
                .title('Delete confirmation')
                .textContent('Do you really want to logout ?')
                .ariaLabel('Logout confirmation')
                .clickOutsideToClose(true)
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(){
                // Remove data
                dataCacheService.removeToken();
                dataCacheService.removeUserId();
                // Go to login state
                $state.go('login');
            });
        }
    }

})();
