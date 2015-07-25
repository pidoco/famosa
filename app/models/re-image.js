import DS from 'ember-data';
import sha from "npm:sha-lite";
import tea from "npm:qqtea";

export default DS.Model.extend({
  hashedCode: DS.attr('string'),
  code: function(key, value, previousValue) {
    // setter
    if (arguments.length > 1) {
      this.set('hashedCode', value.sha256());
    }

    // getter
    return this.get('hashedCode');
  }.property('hashedCode'),
  encryptedSrc: DS.attr('string'),
  src: function(key, value, previousValue) {
    // setter
    if (arguments.length > 1) {
      // TODO use code for encryption
      this.set('encryptedSrc', tea.encrypt('top-secret-todo', value));
    }

    // getter
    return tea.decrypt('top-secret-todo', this.get('encryptedSrc'));
  }.property('encryptedSrc'),
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
