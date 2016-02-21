/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 20/02/16
 * Licence: See Readme
 */
(function () {
    'use strict';

    angular
        .module('ozra.administration.groups', [
            'ozra.administration.groups.list',
            'ozra.administration.groups.new',
            'ozra.administration.groups.edit'
        ]);

})();