import Ember from 'ember';
import sha from "npm:sha-lite";

export default Ember.Route.extend({
  setupController: function (controller) {
    controller.set('model', this.store.findAll('image'));
    this._pushingNewImages();
    this._pullingNewImages();
  },
  _pullingNewImages() {
    var that = this;

    this.store.findAll('re-image').then(function (reImages) {
      reImages.forEach(function (reImage) {
        that.store.findAll('image').then(function (images) {
          if (!images.findBy('foreignId', reImage.get('foreignId').sha256())) {
            that.store.findAll('group').then(function (groups) {
              groups.forEach(function (group) {
                if (group.get('code').sha256() === reImage.get('code')) {
                  that._storeImage('top-secret', reImage.get('src'), reImage.get('expiresAt'), reImage.get('foreignId'));
                }
              });
            });
          }
        });
      });
    });
  },
  _pushingNewImages() {
    var that = this;
    this.store.findAll('source').then(function (sources) {
      sources.forEach(function (source) {
        Ember.$.ajax('https://api.dropbox.com/1/metadata/auto/' + source.get('folder'), {
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + source.get('token')
          }
        }).then(function (data) {
          that._storeImagesIntoGroups(data.contents, source.get('token'));
        });
      });
    });
  },
  _storeImagesIntoGroups(images, token) {
    var that = this;
    images.forEach(function (image) {
      that.store.findAll('image').then(function (images) {
        if (!images.findBy('foreignId', image.path.sha256())) {
          that._storeImageIntoGroups(image, token);
        }
      });
    });
  },
  _storeImageIntoGroups(image, token) {
    var that = this;
    this.store.findAll('group').then(function (groups) {
      groups.forEach(function (group) {
        if (group.get('enabledAt') &&
          image.mime_type &&
          image.mime_type.indexOf('image') === 0 &&
          group.get('enabledAt') < Date.parse(image.modified)) {
          that._getPublicImageSrc(image.path, token).then(function (data) {
            that._storeImage(group.get('code'), data.url, Date.parse(data.expires), image.path);
            that._storeImage(group.get('code'), data.url, Date.parse(data.expires), image.path, true);
          });
        }
      });
    });
  },
  _storeImage(code, url, expiresAt, foreignId, remote) {
    this.store.createRecord(remote ? 're-image' : 'image', {
      code: code,
      src: url,
      expiresAt: expiresAt,
      foreignId: foreignId
    }).save();
  },
  _getPublicImageSrc(imagePath, token) {
    return Ember.$.ajax('https://api.dropbox.com/1/media/auto/' + imagePath, {
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
  }
});

