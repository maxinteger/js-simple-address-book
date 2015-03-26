(function(angular){
    'use strict';

    angular.module('ContactApp.editor', [])
        .constant('ON_CONTACT_EDITOR_UPDATE', 'contact-editor-update')
    /**
     * Contact editor controller
     */
        .controller('ContactEditCtrl', function($scope, $rootScope, $location, $routeParams, ContactService, ON_CONTACT_EDITOR_UPDATE){
            var self = this,
                originalContact = {};

            self.labels = ['Home', 'Work', 'Other'];

            /**
             * Jump back to the welcome page
             */
            function redirect(){
                $location.path('/');
            }

            /**
             * Watch contact id parameter of URL
             */
            $scope.$watch(function(){
                return $routeParams.contactId;
            }, function(newContactId){
                if (newContactId === 'new'){
                    // if id is 'new' we create a new contact
                    self.contact = ContactService.$create();
                } else if (newContactId === void 0 || !/^\d+$/.test(newContactId)){
                    // if id undefined then we jump to the welcome page
                    redirect();
                } else {
                    // otherwise we get the contact from the server
                    ContactService.get({id: $routeParams.contactId}, function (contact) {
                        if (contact && contact.id){
                            // if contact is exists then we set $scope and save the original values
                            self.contact = contact;
                            originalContact = contact.clone();
                        } else {
                            // otherwise we jump to the welcome page
                            redirect();
                        }
                    });
                }
            });

            self.addPhone = function(){
                self.contact.addPhone();
            };

            self.removePhone = function(idx){
                self.contact.removePhone(idx);
            };

            self.addEmail = function(){
                self.contact.addEmail();
            };

            self.removeEmail = function(idx){
                self.contact.removeEmail(idx);
            };

            /**
             * Reset form
             * @param {object}form  Angular form controller
             */
            self.reset = function(form){
                if (form) {
                    form.$setPristine();
                    form.$setUntouched();
                }
                _.extend(self.contact, originalContact);
            };

            /**
             * Remove contact
             */
            self.remove = function removeContact(){
                if(confirm('Are you sure?')){
                    self.contact.$delete(function(){
                        redirect();
                        $rootScope.$broadcast(ON_CONTACT_EDITOR_UPDATE);
                    });
                }

            };

            /**
             * Save contact changes
             */
            self.save = function saveContact(){
                self.contact.$save(function(contact){
                    $rootScope.$broadcast(ON_CONTACT_EDITOR_UPDATE);
                    $location.path('/contact/' + contact.id);
                });
            };
        });
})(angular);
