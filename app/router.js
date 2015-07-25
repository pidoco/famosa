import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('images');
  this.route('sources');
  this.route('404-error', { path: '/*wildcard' });
  this.route('groups');
});

export default Router;
