/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 12/01/16
 * Licence: See Readme
 */

(function(){
    'use strict';

    angular.module('ozra', [
        'ozra.core',
        'ozra.login',
        'ozra.header',
        'ozra.actions',
        'ozra.parameters',
        'ozra.administration',
        'ozra.dialogs',
        'ozra.technical'
    ]);
})();
