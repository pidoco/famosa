import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.findAll('source'));
  },
  actions: {
    createSource: function (token, folder) {
      this.store.createRecord('source', {
        token: token,
        folder: folder
      }).save();
    },
    deleteSource: function (source) {
      this.store.find('source', source.id).then(function (source) {
        source.destroyRecord();
      });
    }
  }
});
