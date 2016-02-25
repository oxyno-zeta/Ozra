/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 22/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.edit')
        .controller('UserEditAdminController', UserEditAdminController);

    /** @ngInject */
    function UserEditAdminController($mdToast, $mdDialog, $timeout, $state, userService, allGroups, userPopulated) {
        var vm = this;
        // Variables
        vm.isFabOpen = false;
        vm.disableEdit = true;
        vm.user = userPopulated;
        vm.checkPassword = '';
        vm.passwordNotOk = true;
        vm.selectedIndex = 0;
        // Functions
        vm.checkIsPasswordNotOk = checkIsPasswordNotOk;
        vm.isUserComplete = isUserComplete;
        vm.filterCurrentGroups = filterCurrentGroups;
        vm.fabMouseClick = fabMouseClick;
        vm.enterEditMode = enterEditMode;
        vm.leaveEditMode = leaveEditMode;
        vm.deleteUser = deleteUser;
        vm.save = save;
        vm.savePassword = savePassword;

        // Private
        var userCopy;

        ////////////////

        /**
         * Save new password for user
         */
        function savePassword(){
            var user = _.cloneDeep(userPopulated);
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
                $state.reload('ozra.administration.users.edit', {
                    id: user.id
                });
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
         * Save
         */
        function save(){
            // Copy object
            var userToPost = _.cloneDeep(vm.user);
            // Transform groups
            var groupIds = [];
            _.forEach(userToPost.groups, function(group){
                groupIds.push(group.id);
            });
            // Put it in place
            userToPost.groups = groupIds;
            // Save action
            userService.updateUser(userToPost).then(function(user){
                $state.go('ozra.administration.users.edit', {
                    id: user.id
                }, {reload:true});
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('Update user failed !')
                    .position('top right')
                    .hideDelay(1500);

                // Show toast
                $mdToast.show(toast);
            });
        }

        /**
         * Delete user
         * @param event
         */
        function deleteUser(event){
            // Confirm dialog creation
            var confirm = $mdDialog.confirm()
                .title('Delete confirmation')
                .textContent('Are you sure about deleting "' + userPopulated.name + '" ?')
                .ariaLabel('Delete confirmation')
                .clickOutsideToClose(true)
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(){
                // Ok
                userService.deleteUser(userPopulated).then(function(result){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete user succeed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);

                    // Wait a little
                    $timeout(function(){
                        $state.go('ozra.administration.users', null, {reload: true});
                    }, 300);
                }, function(){
                    // Create toast
                    var toast = $mdToast.simple()
                        .textContent('Delete user failed !')
                        .position('top right')
                        .hideDelay(1500);

                    // Show toast
                    $mdToast.show(toast);
                });
            });
        }

        /**
         * Check if password is not ok
         */
        function checkIsPasswordNotOk(){
            var result = false; // Default is ok

            if (_.isEqual(vm.user.password, '') ||
                _.isEqual(vm.checkPassword, '') ||
                !_.isEqual(vm.user.password, vm.checkPassword)){
                result = true;
            }

            // Put data
            vm.passwordNotOk = result;
        }

        /**
         * Check if user complete
         * @returns {boolean}
         */
        function isUserComplete(){
            var user = vm.user;

            if (_.isUndefined(user.name) || _.isEqual(user.name, '')){
                return false;
            }

            if (_.isEqual(user.groups.length, 0)){
                return false;
            }

            return true; // default ok
        }

        /**
         * Filter text in current groups
         * @param searchText
         * @returns {*|Array.<T>}
         */
        function filterCurrentGroups(searchText){
            var itemNameL;
            var searchTextL = angular.lowercase(searchText);
            return allGroups.filter(function(item){
                itemNameL = angular.lowercase(item.name);
                return (!_.isEqual(itemNameL.indexOf(searchTextL) ,-1));
            });
        }

        /**
         * On mouse click for FAB
         */
        function fabMouseClick(){
            vm.isFabOpen = !vm.isFabOpen;
        }

        /**
         * Enter in edit mode
         */
        function enterEditMode(){
            // Copy
            userCopy = _.cloneDeep(vm.user);
            // Enable edit
            vm.disableEdit = false;
        }

        /**
         * Leave edit mode
         */
        function leaveEditMode(){
            // Replace
            vm.user = userCopy;
            vm.checkPassword = '';
            // Disable edit
            vm.disableEdit = true;
        }

    }

})();
