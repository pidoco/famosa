import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    leave: function(group) {
      this.sendAction('leave', group);
    },
    enable: function(group) {
      this.sendAction('enable', group);
    },
    disable: function(group) {
      this.sendAction('disable', group);
    }
  }
});
