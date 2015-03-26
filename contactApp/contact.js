(function(doc, $, angular){
    'use strict';

    angular.module('ContactApp', [
        'ngResource',
        'ngRoute',
        'ContactApp.editor',
        'ContactApp.list',
        'ContactApp.mock'
    ])
        /*
        Configure routes
         */
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'contactApp/editor/welcome.html'
                })
                .when('/contact/:contactId', {
                    templateUrl: 'contactApp/editor/editor.html',
                    controller: 'ContactEditCtrl',
                    controllerAs: 'EditCtrl'
                })
                .otherwise('/');
        });

})(document, jQuery, angular);
