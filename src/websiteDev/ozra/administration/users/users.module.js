/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 19/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.users', [
            'ozra.administration.users.list',
            'ozra.administration.users.new',
            'ozra.administration.users.edit'
        ]);

})();