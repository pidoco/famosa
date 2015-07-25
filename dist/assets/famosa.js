/* jshint ignore:start */

/* jshint ignore:end */

define('famosa/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].LSAdapter.extend({
    namespace: 'famosa'
  });

});
define('famosa/adapters/re-group', ['exports', 'ember-parse-adapter/adapters/application'], function (exports, parseAdapter) {

	'use strict';

	exports['default'] = parseAdapter['default'];

});
define('famosa/adapters/re-image', ['exports', 'ember-parse-adapter/adapters/application'], function (exports, parseAdapter) {

	'use strict';

	exports['default'] = parseAdapter['default'];

});
define('famosa/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'famosa/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

  // TODO add https://github.com/runspired/ember-mobiletouch

});
define('famosa/components/create-source', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      create: function create() {
        // TODO validate fields
        this.sendAction('action', this.get('token'), this.get('folder'));
        this.set('token', '');
        this.set('folder', '');
      }
    }
  });

});
define('famosa/components/join-group', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      join: function join() {
        // TODO validate fields
        this.sendAction('action', this.get('code'));
        this.set('code', '');
      }
    }
  });

});
define('famosa/components/list-groups', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      leave: function leave(group) {
        this.sendAction('leave', group);
      },
      enable: function enable(group) {
        this.sendAction('enable', group);
      },
      disable: function disable(group) {
        this.sendAction('disable', group);
      }
    }
  });

});
define('famosa/components/list-sources', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      'delete': function _delete(source) {
        this.sendAction('action', source);
      }
    }
  });

});
define('famosa/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('famosa/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('famosa/file', ['exports', 'ember-parse-adapter/file'], function (exports, file) {

	'use strict';

	exports['default'] = file['default'];

});
define('famosa/geopoint', ['exports', 'ember-parse-adapter/geopoint'], function (exports, geopoint) {

	'use strict';

	exports['default'] = geopoint['default'];

});
define('famosa/initializers/export-application-global', ['exports', 'ember', 'famosa/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('famosa/initializers/initialize', ['exports', 'ember-parse-adapter/initializers/initialize'], function (exports, initializer) {

  'use strict';

  exports['default'] = {
    name: 'ember-parse-adapter',

    after: 'ember-data',

    initialize: initializer['default']
  };

});
define('famosa/instance-initializers/app-version', ['exports', 'famosa/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('famosa/models/group', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    code: DS['default'].attr('string'),
    enabledAt: DS['default'].attr('number')
  });

});
define('famosa/models/image', ['exports', 'ember-data', 'npm:sha-lite'], function (exports, DS, sha) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    code: DS['default'].attr('string'),
    src: DS['default'].attr('string'),
    expiresAt: DS['default'].attr('string'),
    hashedForeignId: DS['default'].attr('string'),
    foreignId: (function (key, value, previousValue) {
      // setter
      if (arguments.length > 1) {
        this.set('hashedForeignId', value.sha256());
      }

      // getter
      return this.get('hashedForeignId');
    }).property('hashedForeignId')
  });

});
define('famosa/models/re-image', ['exports', 'ember-data', 'npm:sha-lite', 'npm:qqtea'], function (exports, DS, sha, tea) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    hashedCode: DS['default'].attr("string"),
    code: (function (key, value, previousValue) {
      // setter
      if (arguments.length > 1) {
        this.set("hashedCode", value.sha256());
      }

      // getter
      return this.get("hashedCode");
    }).property("hashedCode"),
    encryptedSrc: DS['default'].attr("string"),
    src: (function (key, value, previousValue) {
      // setter
      if (arguments.length > 1) {
        // TODO use code for encryption
        this.set("encryptedSrc", tea['default'].encrypt("top-secret-todo", value));
      }

      // getter
      return tea['default'].decrypt("top-secret-todo", this.get("encryptedSrc"));
    }).property("encryptedSrc"),
    expiresAt: DS['default'].attr("string"),
    hashedForeignId: DS['default'].attr("string"),
    foreignId: (function (key, value, previousValue) {
      // setter
      if (arguments.length > 1) {
        this.set("hashedForeignId", value.sha256());
      }

      // getter
      return this.get("hashedForeignId");
    }).property("hashedForeignId")
  });

});
define('famosa/models/source', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    token: DS['default'].attr('string'),
    folder: DS['default'].attr('string'),
    shortenToken: (function () {
      return this.get('token').substr(0, 10) + '...';
    }).property()
  });

});
define('famosa/router', ['exports', 'ember', 'famosa/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('images');
    this.route('sources');
    this.route('404-error', { path: '/*wildcard' });
    this.route('groups');
  });

  exports['default'] = Router;

});
define('famosa/routes/404-error', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('famosa/routes/groups', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      controller.set('model', this.store.findAll('group'));
    },
    actions: {
      joinGroup: function joinGroup(code) {
        this.store.createRecord('group', {
          code: code
        }).save();
      },
      leaveGroup: function leaveGroup(group) {
        this.store.find('group', group.id).then(function (group) {
          group.destroyRecord();
        });
      },
      enableGroup: function enableGroup(group) {
        this.store.find('group', group.id).then(function (group) {
          group.set('enabledAt', Date.now()).save();
        });
      },
      disableGroup: function disableGroup(group) {
        this.store.find('group', group.id).then(function (group) {
          group.set('enabledAt', null).save();
        });
      }
    }
  });

});
define('famosa/routes/images', ['exports', 'ember', 'npm:sha-lite'], function (exports, Ember, sha) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      controller.set('model', this.store.findAll('image'));
      this._pushingNewImages();
      this._pullingNewImages();
    },
    _pullingNewImages: function _pullingNewImages() {
      var that = this;

      this.store.findAll('re-image').then(function (reImages) {
        reImages.forEach(function (reImage) {
          that.store.findAll('image').then(function (images) {
            if (!images.findBy('foreignId', reImage.get('foreignId').sha256())) {
              that.store.findAll('group').then(function (groups) {
                groups.forEach(function (group) {
                  if (group.get('code').sha256() === reImage.get('code')) {
                    that._storeImage(group.get('code'), reImage.get('src'), reImage.get('expiresAt'), reImage.get('foreignId'));
                  }
                });
              });
            }
          });
        });
      });
    },
    _pushingNewImages: function _pushingNewImages() {
      var that = this;
      this.store.findAll('source').then(function (sources) {
        sources.forEach(function (source) {
          Ember['default'].$.ajax('https://api.dropbox.com/1/metadata/auto/' + source.get('folder'), {
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
    _storeImagesIntoGroups: function _storeImagesIntoGroups(images, token) {
      var that = this;
      images.forEach(function (image) {
        that.store.findAll('image').then(function (images) {
          if (!images.findBy('foreignId', image.path.sha256())) {
            that._storeImageIntoGroups(image, token);
          }
        });
      });
    },
    _storeImageIntoGroups: function _storeImageIntoGroups(image, token) {
      var that = this;
      this.store.findAll('group').then(function (groups) {
        groups.forEach(function (group) {
          if (group.get('enabledAt') && image.mime_type && image.mime_type.indexOf('image') === 0 && group.get('enabledAt') < Date.parse(image.modified)) {
            that._getPublicImageSrc(image.path, token).then(function (data) {
              that._storeImage(group.get('code'), data.url, Date.parse(data.expires), image.path);
              that._storeImage(group.get('code'), data.url, Date.parse(data.expires), image.path, true);
            });
          }
        });
      });
    },
    _storeImage: function _storeImage(code, url, expiresAt, foreignId, remote) {
      this.store.createRecord(remote ? 're-image' : 'image', {
        code: code,
        src: url,
        expiresAt: expiresAt,
        foreignId: foreignId
      }).save();
    },
    _getPublicImageSrc: function _getPublicImageSrc(imagePath, token) {
      return Ember['default'].$.ajax('https://api.dropbox.com/1/media/auto/' + imagePath, {
        dataType: 'json',
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
    }
  });

});
define('famosa/routes/sources', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller) {
      controller.set('model', this.store.findAll('source'));
    },
    actions: {
      createSource: function createSource(token, folder) {
        this.store.createRecord('source', {
          token: token,
          folder: folder
        }).save();
      },
      deleteSource: function deleteSource(source) {
        this.store.find('source', source.id).then(function (source) {
          source.destroyRecord();
        });
      }
    }
  });

});
define('famosa/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].LSSerializer;

});
define('famosa/serializers/re-group', ['exports', 'ember-parse-adapter/serializers/application'], function (exports, parseSerializer) {

	'use strict';

	exports['default'] = parseSerializer['default'];

});
define('famosa/serializers/re-image', ['exports', 'ember-parse-adapter/serializers/application'], function (exports, parseSerializer) {

	'use strict';

	exports['default'] = parseSerializer['default'];

});
define('famosa/templates/404-error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 3
          }
        },
        "moduleName": "famosa/templates/404-error.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("404");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('famosa/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 14
            },
            "end": {
              "line": 5,
              "column": 42
            }
          },
          "moduleName": "famosa/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Images");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 14
            },
            "end": {
              "line": 8,
              "column": 42
            }
          },
          "moduleName": "famosa/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Groups");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 14
            },
            "end": {
              "line": 11,
              "column": 44
            }
          },
          "moduleName": "famosa/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Sources");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "famosa/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-default navbar-fixed-top");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","nav nav-pills");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"role","presentation");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"role","presentation");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("li");
        dom.setAttribute(el4,"role","presentation");
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["images"],[],0,null,["loc",[null,[5,14],[5,54]]]],
        ["block","link-to",["groups"],[],1,null,["loc",[null,[8,14],[8,54]]]],
        ["block","link-to",["sources"],[],2,null,["loc",[null,[11,14],[11,56]]]],
        ["content","outlet",["loc",[null,[18,2],[18,12]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('famosa/templates/components/create-source', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 6
          }
        },
        "moduleName": "famosa/templates/components/create-source.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Add Source");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("\n                    Token\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("\n                    Folder\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("Add Source");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1]);
        var element1 = dom.childAt(element0, [5]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),3,3);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),3,3);
        morphs[2] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [
        ["inline","input",[],["class","form-control","type","text","value",["subexpr","@mut",[["get","token",["loc",[null,[11,61],[11,66]]]]],[],[]]],["loc",[null,[11,14],[11,68]]]],
        ["inline","input",[],["class","form-control","type","text","value",["subexpr","@mut",[["get","folder",["loc",[null,[17,61],[17,67]]]]],[],[]]],["loc",[null,[17,14],[17,69]]]],
        ["element","action",["create"],[],["loc",[null,[19,44],[19,63]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('famosa/templates/components/join-group', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 6
          }
        },
        "moduleName": "famosa/templates/components/join-group.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Join Group");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Joining an non-existing group will create it. To create a private group chose a hard to guess code.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("form");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","form-group");
        var el5 = dom.createTextNode("\n                ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        var el6 = dom.createTextNode("\n                    Code\n                ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n              ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"class","btn btn-primary");
        var el5 = dom.createTextNode("Join Group");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 3]);
        var element1 = dom.childAt(element0, [3]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),3,3);
        morphs[1] = dom.createElementMorph(element1);
        return morphs;
      },
      statements: [
        ["inline","input",[],["class","form-control","type","text","value",["subexpr","@mut",[["get","code",["loc",[null,[12,61],[12,65]]]]],[],[]]],["loc",[null,[12,14],[12,67]]]],
        ["element","action",["join"],[],["loc",[null,[14,44],[14,61]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('famosa/templates/components/list-groups', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 13,
                  "column": 20
                },
                "end": {
                  "line": 15,
                  "column": 20
                }
              },
              "moduleName": "famosa/templates/components/list-groups.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-succes");
              var el2 = dom.createTextNode("Stop");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element1);
              return morphs;
            },
            statements: [
              ["element","action",["disable",["get","group",["loc",[null,[14,74],[14,79]]]]],[],["loc",[null,[14,55],[14,81]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        var child1 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.3",
              "loc": {
                "source": null,
                "start": {
                  "line": 16,
                  "column": 20
                },
                "end": {
                  "line": 18,
                  "column": 20
                }
              },
              "moduleName": "famosa/templates/components/list-groups.hbs"
            },
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("button");
              dom.setAttribute(el1,"class","btn btn-primary");
              var el2 = dom.createTextNode("Start");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element0 = dom.childAt(fragment, [1]);
              var morphs = new Array(1);
              morphs[0] = dom.createElementMorph(element0);
              return morphs;
            },
            statements: [
              ["element","action",["enable",["get","group",["loc",[null,[17,74],[17,79]]]]],[],["loc",[null,[17,56],[17,81]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.3",
            "loc": {
              "source": null,
              "start": {
                "line": 10,
                "column": 10
              },
              "end": {
                "line": 22,
                "column": 10
              }
            },
            "moduleName": "famosa/templates/components/list-groups.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","list-group-item");
            var el2 = dom.createTextNode("\n                  ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"class","btn-group");
            dom.setAttribute(el2,"role","group");
            dom.setAttribute(el2,"aria-label","...");
            var el3 = dom.createTextNode("\n");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("                  ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" (");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            var el3 = dom.createTextNode("leave");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(")\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var element3 = dom.childAt(element2, [1]);
            var element4 = dom.childAt(element2, [5]);
            var morphs = new Array(4);
            morphs[0] = dom.createMorphAt(element3,1,1);
            morphs[1] = dom.createMorphAt(element3,2,2);
            morphs[2] = dom.createMorphAt(element2,3,3);
            morphs[3] = dom.createElementMorph(element4);
            return morphs;
          },
          statements: [
            ["block","if",[["get","group.enabledAt",["loc",[null,[13,26],[13,41]]]]],[],0,null,["loc",[null,[13,20],[15,27]]]],
            ["block","unless",[["get","group.enabledAt",["loc",[null,[16,30],[16,45]]]]],[],1,null,["loc",[null,[16,20],[18,31]]]],
            ["content","group.code",["loc",[null,[20,16],[20,30]]]],
            ["element","action",["leave",["get","group",["loc",[null,[20,52],[20,57]]]]],[],["loc",[null,[20,35],[20,59]]]]
          ],
          locals: ["group"],
          templates: [child0, child1]
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 25,
              "column": 0
            }
          },
          "moduleName": "famosa/templates/components/list-groups.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Joined Groups");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-body");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createTextNode("Enable group to share new uploaded images with the group.");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","list-group");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 5]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","groups",["loc",[null,[10,18],[10,24]]]]],[],0,null,["loc",[null,[10,10],[22,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 25,
            "column": 7
          }
        },
        "moduleName": "famosa/templates/components/list-groups.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","groups",["loc",[null,[1,6],[1,12]]]]],[],0,null,["loc",[null,[1,0],[25,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('famosa/templates/components/list-sources', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.3",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 10
              },
              "end": {
                "line": 12,
                "column": 10
              }
            },
            "moduleName": "famosa/templates/components/list-sources.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("              ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","list-group-item");
            var el2 = dom.createTextNode("\n                  ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"class","btn btn-danger");
            var el3 = dom.createTextNode("Delete");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n                ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode(" / ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n              ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element1);
            morphs[1] = dom.createMorphAt(element0,3,3);
            morphs[2] = dom.createMorphAt(element0,5,5);
            return morphs;
          },
          statements: [
            ["element","action",["delete",["get","source",["loc",[null,[9,67],[9,73]]]]],[],["loc",[null,[9,49],[9,75]]]],
            ["content","source.folder",["loc",[null,[10,16],[10,33]]]],
            ["content","source.shortenToken",["loc",[null,[10,36],[10,59]]]]
          ],
          locals: ["source"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 15,
              "column": 0
            }
          },
          "moduleName": "famosa/templates/components/list-sources.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","panel-heading");
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h3");
          dom.setAttribute(el3,"class","panel-title");
          var el4 = dom.createTextNode("Added Sources");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","list-group");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
          return morphs;
        },
        statements: [
          ["block","each",[["get","sources",["loc",[null,[7,18],[7,25]]]]],[],0,null,["loc",[null,[7,10],[12,19]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 15,
            "column": 7
          }
        },
        "moduleName": "famosa/templates/components/list-sources.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","if",[["get","sources",["loc",[null,[1,6],[1,13]]]]],[],0,null,["loc",[null,[1,0],[15,7]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('famosa/templates/groups', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "famosa/templates/groups.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Groups ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createTextNode("Joined");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,4,4,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,6,6,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","list-groups",[],["leave","leaveGroup","enable","enableGroup","disable","disableGroup","groups",["subexpr","@mut",[["get","model",["loc",[null,[3,84],[3,89]]]]],[],[]]],["loc",[null,[3,0],[3,91]]]],
        ["inline","join-group",[],["action","joinGroup"],["loc",[null,[4,0],[4,33]]]],
        ["content","outlet",["loc",[null,[6,0],[6,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('famosa/templates/images', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 0
            },
            "end": {
              "line": 11,
              "column": 0
            }
          },
          "moduleName": "famosa/templates/images.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  No shared images, yet.\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.3",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 0
            },
            "end": {
              "line": 18,
              "column": 0
            }
          },
          "moduleName": "famosa/templates/images.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","panel panel-default panel-image");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","label label-info");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.setAttribute(el2,"class","img-responsive");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [3]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          morphs[1] = dom.createAttrMorph(element1, 'src');
          return morphs;
        },
        statements: [
          ["content","image.code",["loc",[null,[15,39],[15,53]]]],
          ["attribute","src",["concat",[["get","image.src",["loc",[null,[16,20],[16,29]]]]]]]
        ],
        locals: ["image"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "famosa/templates/images.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Images\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createTextNode("Shared");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","alert alert-warning");
        dom.setAttribute(el1,"role","alert");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("strong");
        var el3 = dom.createTextNode("Keep in mind!");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" Currently the privacy of your shared images cannot be guaranteed.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,4,4,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,6,6,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,8,8,contextualElement);
        return morphs;
      },
      statements: [
        ["block","unless",[["get","model",["loc",[null,[9,10],[9,15]]]]],[],0,null,["loc",[null,[9,0],[11,11]]]],
        ["block","each",[["get","model",["loc",[null,[13,8],[13,13]]]]],[],1,null,["loc",[null,[13,0],[18,9]]]],
        ["content","outlet",["loc",[null,[20,0],[20,10]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('famosa/templates/sources', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.3",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 8,
            "column": 0
          }
        },
        "moduleName": "famosa/templates/sources.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Sources ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        var el3 = dom.createTextNode("Dropbox");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,4,4,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,6,6,contextualElement);
        return morphs;
      },
      statements: [
        ["inline","list-sources",[],["action","deleteSource","sources",["subexpr","@mut",[["get","model",["loc",[null,[3,45],[3,50]]]]],[],[]]],["loc",[null,[3,0],[3,52]]]],
        ["inline","create-source",[],["action","createSource"],["loc",[null,[4,0],[4,39]]]],
        ["content","outlet",["loc",[null,[6,0],[6,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('famosa/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('famosa/tests/adapters/re-group.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/re-group.js should pass jshint', function() { 
    ok(true, 'adapters/re-group.js should pass jshint.'); 
  });

});
define('famosa/tests/adapters/re-image.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/re-image.js should pass jshint', function() { 
    ok(true, 'adapters/re-image.js should pass jshint.'); 
  });

});
define('famosa/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('famosa/tests/components/create-source.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/create-source.js should pass jshint', function() { 
    ok(true, 'components/create-source.js should pass jshint.'); 
  });

});
define('famosa/tests/components/join-group.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/join-group.js should pass jshint', function() { 
    ok(true, 'components/join-group.js should pass jshint.'); 
  });

});
define('famosa/tests/components/list-groups.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/list-groups.js should pass jshint', function() { 
    ok(true, 'components/list-groups.js should pass jshint.'); 
  });

});
define('famosa/tests/components/list-sources.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/list-sources.js should pass jshint', function() { 
    ok(true, 'components/list-sources.js should pass jshint.'); 
  });

});
define('famosa/tests/helpers/resolver', ['exports', 'ember/resolver', 'famosa/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('famosa/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('famosa/tests/helpers/start-app', ['exports', 'ember', 'famosa/app', 'famosa/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('famosa/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('famosa/tests/integration/components/create-source-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('create-source', 'Integration | Component | create source', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 17
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'create-source', ['loc', [null, [1, 0], [1, 17]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.3',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'create-source', [], [], 0, null, ['loc', [null, [2, 4], [4, 22]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('famosa/tests/integration/components/create-source-test.jshint', function () {

  'use strict';

  module('JSHint - integration/components');
  test('integration/components/create-source-test.js should pass jshint', function() { 
    ok(true, 'integration/components/create-source-test.js should pass jshint.'); 
  });

});
define('famosa/tests/integration/components/join-group-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('join-group', 'Integration | Component | join group', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 14
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'join-group', ['loc', [null, [1, 0], [1, 14]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.3',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'join-group', [], [], 0, null, ['loc', [null, [2, 4], [4, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('famosa/tests/integration/components/join-group-test.jshint', function () {

  'use strict';

  module('JSHint - integration/components');
  test('integration/components/join-group-test.js should pass jshint', function() { 
    ok(true, 'integration/components/join-group-test.js should pass jshint.'); 
  });

});
define('famosa/tests/integration/components/list-groups-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('list-groups', 'Integration | Component | list groups', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'list-groups', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.3',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'list-groups', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('famosa/tests/integration/components/list-groups-test.jshint', function () {

  'use strict';

  module('JSHint - integration/components');
  test('integration/components/list-groups-test.js should pass jshint', function() { 
    ok(true, 'integration/components/list-groups-test.js should pass jshint.'); 
  });

});
define('famosa/tests/integration/components/list-sources-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('list-sources', 'Integration | Component | list sources', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 16
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'list-sources', ['loc', [null, [1, 0], [1, 16]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.3',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.3',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'list-sources', [], [], 0, null, ['loc', [null, [2, 4], [4, 21]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('famosa/tests/integration/components/list-sources-test.jshint', function () {

  'use strict';

  module('JSHint - integration/components');
  test('integration/components/list-sources-test.js should pass jshint', function() { 
    ok(true, 'integration/components/list-sources-test.js should pass jshint.'); 
  });

});
define('famosa/tests/models/group.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/group.js should pass jshint', function() { 
    ok(true, 'models/group.js should pass jshint.'); 
  });

});
define('famosa/tests/models/image.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/image.js should pass jshint', function() { 
    ok(false, 'models/image.js should pass jshint.\nmodels/image.js: line 2, col 8, \'sha\' is defined but never used.\nmodels/image.js: line 9, col 35, \'previousValue\' is defined but never used.\n\n2 errors'); 
  });

});
define('famosa/tests/models/re-image.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/re-image.js should pass jshint', function() { 
    ok(false, 'models/re-image.js should pass jshint.\nmodels/re-image.js: line 2, col 8, \'sha\' is defined but never used.\nmodels/re-image.js: line 7, col 30, \'previousValue\' is defined but never used.\nmodels/re-image.js: line 17, col 29, \'previousValue\' is defined but never used.\nmodels/re-image.js: line 29, col 35, \'previousValue\' is defined but never used.\n\n4 errors'); 
  });

});
define('famosa/tests/models/source.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/source.js should pass jshint', function() { 
    ok(true, 'models/source.js should pass jshint.'); 
  });

});
define('famosa/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('famosa/tests/routes/404-error.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/404-error.js should pass jshint', function() { 
    ok(true, 'routes/404-error.js should pass jshint.'); 
  });

});
define('famosa/tests/routes/groups.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/groups.js should pass jshint', function() { 
    ok(true, 'routes/groups.js should pass jshint.'); 
  });

});
define('famosa/tests/routes/images.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/images.js should pass jshint', function() { 
    ok(false, 'routes/images.js should pass jshint.\nroutes/images.js: line 2, col 8, \'sha\' is defined but never used.\n\n1 error'); 
  });

});
define('famosa/tests/routes/sources.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/sources.js should pass jshint', function() { 
    ok(true, 'routes/sources.js should pass jshint.'); 
  });

});
define('famosa/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('famosa/tests/serializers/re-group.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/re-group.js should pass jshint', function() { 
    ok(true, 'serializers/re-group.js should pass jshint.'); 
  });

});
define('famosa/tests/serializers/re-image.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/re-image.js should pass jshint', function() { 
    ok(true, 'serializers/re-image.js should pass jshint.'); 
  });

});
define('famosa/tests/test-helper', ['famosa/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('famosa/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'Unit | Adapter | application', {});

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('famosa/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/models/group-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('group', 'Unit | Model | group', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('famosa/tests/unit/models/group-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/group-test.js should pass jshint', function() { 
    ok(true, 'unit/models/group-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/models/image-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('image', 'Unit | Model | image', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('famosa/tests/unit/models/image-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/image-test.js should pass jshint', function() { 
    ok(true, 'unit/models/image-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/models/re-image-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('re-image', 'Unit | Model | re image', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('famosa/tests/unit/models/re-image-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/re-image-test.js should pass jshint', function() { 
    ok(true, 'unit/models/re-image-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/models/source-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('source', 'Unit | Model | source', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('famosa/tests/unit/models/source-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/source-test.js should pass jshint', function() { 
    ok(true, 'unit/models/source-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/routes/404-error-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:404-error', 'Unit | Route | 404 error', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('famosa/tests/unit/routes/404-error-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/404-error-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/404-error-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/routes/groups-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:groups', 'Unit | Route | groups', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('famosa/tests/unit/routes/groups-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/groups-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/groups-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/routes/images-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:images', 'Unit | Route | images', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('famosa/tests/unit/routes/images-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/images-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/images-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/routes/sources-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:sources', 'Unit | Route | sources', {});

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('famosa/tests/unit/routes/sources-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/sources-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/sources-test.js should pass jshint.'); 
  });

});
define('famosa/tests/unit/serializers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('application', 'Unit | Serializer | application', {
    // Specify the other units that are required for this test.
    needs: ['serializer:application']
  });

  // Replace this with your real tests.
  ember_qunit.test('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

});
define('famosa/tests/unit/serializers/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/serializers');
  test('unit/serializers/application-test.js should pass jshint', function() { 
    ok(true, 'unit/serializers/application-test.js should pass jshint.'); 
  });

});
define('famosa/transforms/date', ['exports', 'ember-parse-adapter/transforms/date'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
define('famosa/transforms/file', ['exports', 'ember-parse-adapter/transforms/file'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
define('famosa/transforms/geopoint', ['exports', 'ember-parse-adapter/transforms/geopoint'], function (exports, transform) {

	'use strict';

	exports['default'] = transform['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('famosa/config/environment', ['ember'], function(Ember) {
  var prefix = 'famosa';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("famosa/tests/test-helper");
} else {
  require("famosa/app")["default"].create({"restApiId":"MFRu0jLus3zyQFg7BG0D0ixgA4ApmaIVEF4M1ngr","applicationId":"HyTNFwv4ZFHccOQGoWNpCLRWiUvHgnUHFqeSI5dZ","name":"famosa","version":"0.0.0+4da9dda0"});
}

/* jshint ignore:end */
//# sourceMappingURL=famosa.map