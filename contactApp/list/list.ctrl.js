(function(angular){
    'use strict';
    angular.module('ContactApp.list', ['ContactApp.editor'])
        /**
     * Contact list controller
     */
        .controller('ContactListController', function($scope, $routeParams, ContactService, ON_CONTACT_EDITOR_UPDATE){
            var self = this;

            /**
             * Load the contacts and group by first letter of name
             */
            function loadContacts(){
                ContactService.query(function(contacts){
                    // group by contacts
                    contacts = _.groupBy(contacts, function(o){ return o.name.charAt(0); });
                    // check contact list size
                    self.contacts = _.keys(contacts).length > 0 ? contacts : void 0;
                });
            }

            /**
             * Watch selected contact ID
             */
            $scope.$watch(function(){ return $routeParams.contactId; }, function(newId){
                self.selectedId = newId;
            });

            // Reload contact list after the save event
            $scope.$on(ON_CONTACT_EDITOR_UPDATE, loadContacts);

            // First load
            loadContacts();
        });

})(angular);
