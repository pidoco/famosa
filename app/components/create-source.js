import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    create: function() {
      // TODO validate fields
      this.sendAction('action', this.get('token'), this.get('folder'));
      this.set('token', '');
      this.set('folder', '');
    }
  }
});
