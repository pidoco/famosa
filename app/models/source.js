import DS from 'ember-data';

export default DS.Model.extend({
  token: DS.attr('string'),
  folder: DS.attr('string'),
  shortenToken: function() {
    return this.get('token').substr(0, 10) + '...';
  }.property()
});
