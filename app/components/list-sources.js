import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    delete: function(source) {
      this.sendAction('action', source);
    }
  }
});
