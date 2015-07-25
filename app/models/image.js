import DS from 'ember-data';
import sha from "npm:sha-lite";

export default DS.Model.extend({
  code: DS.attr('string'),
  src: DS.attr('string'),
  expiresAt: DS.attr('string'),
  hashedForeignId: DS.attr('string'),
  foreignId: function(key, value, previousValue) {
    // setter
    if (arguments.length > 1) {
      this.set('hashedForeignId', value.sha256());
    }

    // getter
    return this.get('hashedForeignId');
  }.property('hashedForeignId')
});
