/*
 * Author: Alexandre Havrileck (Oxyno-zeta) 
 * Date: 26/01/16
 * Licence: See Readme
 */

(function () {
    'use strict';

    angular
        .module('ozra.technical.base')
        .run(function(requestService){
            // Set Default Params
            requestService.setDefaultParams();
        });

})();
