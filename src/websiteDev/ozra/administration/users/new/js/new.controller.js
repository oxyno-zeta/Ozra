/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 22/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users.new')
        .controller('UserNewAdminController', UserNewAdminController);

    /** @ngInject */
    function UserNewAdminController($state, $mdToast, userService, allGroups) {
        var vm = this;
        // Variables
        vm.isFabOpen = false;
        vm.user = userService.createEmptyNew();
        vm.checkPassword = '';
        vm.passwordNotOk = true;
        // Functions
        vm.save = save;
        vm.checkIsPasswordNotOk = checkIsPasswordNotOk;
        vm.isUserComplete = isUserComplete;
        vm.filterCurrentGroups = filterCurrentGroups;
        vm.fabMouseClick = fabMouseClick;

        // Private
        var userToPost;

        ////////////////

        /**
         * Save
         */
        function save(){
            userToPost = _.cloneDeep(vm.user);
            // Change groups
            var groupIds = [];
            _.forEach(userToPost.groups, function(group){
                groupIds.push(group.id);
            });
            // Put groups ids in
            userToPost.groups = groupIds;

            // Post new user
            userService.addNewUser(userToPost).then(function(user){
                // Ok
                $state.go('ozra.administration.users.edit', {
                    id: user.id
                }, {reload:true});
            }, function(){
                // Create toast
                var toast = $mdToast.simple()
                    .textContent('Add group failed !')
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

            if (vm.passwordNotOk){
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
    }

})();
