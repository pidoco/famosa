import DS from 'ember-data';

// TODO add remote group with encryptedName, encryptedTeaser, ...
export default DS.Model.extend({
  code: DS.attr('string'),
  enabledAt: DS.attr('number')
});
