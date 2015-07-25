import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    join: function() {
      // TODO validate fields
      this.sendAction('action', this.get('code'));
      this.set('code', '');
    }
  }
});
