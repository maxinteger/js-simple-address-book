(function(_, angular){
    'use strict';

    angular.module('ContactApp')
    /**
     * Contact service
     */
        .factory('ContactService', function($resource){
            var Contact = $resource('/api/contact/:id', {id: '@id'});

            /**
             * Create a new contact
             *
             * @returns {Contact}
             */
            Contact.$create = function createContact(){
                return new Contact({ name: '', phone: [], email: [] }).addPhone().addEmail();
            };

            // Extend resource prototype
            _.extend(Contact.prototype, {
                /**
                 * Add a empty phone field
                 *
                 * @returns {Contact}
                 */
                addPhone: function() {
                    this.phone.push({label: 'Home', value: ''});
                    return this;
                },
                /**
                 * Remove phone field by index
                 *
                 * @param {number}idx   Phone filed index
                 * @returns {Contact}
                 */
                removePhone: function(idx){
                    _.pullAt(this.phone, idx);
                    return this;
                },
                /**
                 * Add a empty email field
                 *
                 * @returns {Contact}
                 */
                addEmail: function() {
                    this.email.push({label: 'Home', value: ''});
                    return this;
                },
                /**
                 * Remove email field by index
                 * @param {number}idx   Email field index
                 *
                 * @returns {Contact}
                 */
                removeEmail: function(idx){
                    _.pullAt(this.email, idx);
                    return this;
                },
                clone: function(){
                    return _.cloneDeep(this.toJSON());
                }
            });

            return Contact;
        });

})(_, angular);
