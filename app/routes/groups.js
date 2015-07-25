import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.findAll('group'));
  },
  actions: {
    joinGroup: function (code) {
      this.store.createRecord('group', {
        code: code
      }).save();
    },
    leaveGroup: function (group) {
      this.store.find('group', group.id).then(function (group) {
        group.destroyRecord();
      });
    },
    enableGroup: function (group) {
      this.store.find('group', group.id).then(function (group) {
        group.set('enabledAt', Date.now()).save();
      });
    },
    disableGroup: function (group) {
      this.store.find('group', group.id).then(function (group) {
        group.set('enabledAt', null).save();
      });
    }
  }
});
