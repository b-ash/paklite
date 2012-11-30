(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application;

  Application = {
    initialize: function(onSuccess) {
      var Router;
      Router = require('lib/router');
      this.views = {};
      this.router = new Router();
      Backbone.history.start({
        pushState: true
      });
      return onSuccess();
    }
  };

  module.exports = Application;
  
}});

window.require.define({"initialize": function(exports, require, module) {
  
  window.app = require('application');

  console.log('----starting up----');

  $(function() {
    var _this = this;
    return app.initialize(function() {
      return console.log('success');
    });
  });
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  var IndexView, Router, app, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = require('application');

  utils = require('lib/utils');

  IndexView = require('views/index');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      this.index = __bind(this.index, this);
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '*query': 'index'
    };

    Router.prototype.index = function() {
      app.views.indexView = new IndexView();
      return app.views.indexView.render();
    };

    return Router;

  })(Backbone.Router);
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  
  module.exports = {};
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  
  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue && optionalValue.hash === void 0) {
      console.log("Value");
      console.log("====================");
      return console.log(optionalValue);
    }
  });
  
}});

window.require.define({"models/email": function(exports, require, module) {
  var Email,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Email = (function(_super) {

    __extends(Email, _super);

    function Email() {
      return Email.__super__.constructor.apply(this, arguments);
    }

    Email.prototype.url = 'api/v1/create/';

    Email.prototype.defaults = function() {
      return {
        email: ''
      };
    };

    return Email;

  })(Backbone.Model);

  module.exports = Email;
  
}});

window.require.define({"views/index": function(exports, require, module) {
  var Email, IndexView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  Email = require('../models/email');

  IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      this.submitEmail = __bind(this.submitEmail, this);

      this.inputChange = __bind(this.inputChange, this);

      this.afterRender = __bind(this.afterRender, this);
      return IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = '.main-page';

    IndexView.prototype.template = require('./templates/index');

    IndexView.prototype.events = {
      'keypress #email-form': 'inputChange'
    };

    IndexView.prototype.dom = {};

    IndexView.prototype.afterRender = function() {
      this.dom.emailForm = $('#email-form');
      return this.dom.overlay = $('#overlay');
    };

    IndexView.prototype.inputChange = function(event) {
      if (event.keyCode === 13) {
        return this.submitEmail();
      }
    };

    IndexView.prototype.submitEmail = function() {
      var email,
        _this = this;
      this.$('#success').remove();
      email = new Email();
      return email.save('email', this.dom.emailForm.val(), {
        success: function() {
          _this.dom.emailForm.val('');
          _this.dom.overlay.height(315);
          return _this.dom.emailForm.after(require('./templates/success')());
        }
      });
    };

    return IndexView;

  })(View);

  module.exports = IndexView;
  
}});

window.require.define({"views/templates/index": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"signup\">\n    <div id=\"overlay\">\n        <h1>PakLite</h1>\n        <div id=\"pitch\">\n            <p>Prepare for ease of travel</p>\n            <p>With none of the hassle</p>\n        </div>\n        <div id=\"submission\">\n            <label for=\"email-form\">Sign up for the latest PakLite news!</label>\n            <input id=\"email-form\" placeholder=\"me@email.com\" />\n        </div>\n    </div>\n</div>\n";});
}});

window.require.define({"views/templates/success": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"success\">\n    <span>Thanks! We'll keep you posted as PakLite becoems a reality.</span>\n</div>\n";});
}});

window.require.define({"views/view": function(exports, require, module) {
  var View, app, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  utils = require('lib/utils');

  app = require('application');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.routeLink = __bind(this.routeLink, this);

      this.routeEvent = __bind(this.routeEvent, this);

      this.close = __bind(this.close, this);

      this.render = __bind(this.render, this);

      this.getInput = __bind(this.getInput, this);
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.views = {};

    View.prototype.template = function() {};

    View.prototype.getRenderData = function() {};

    View.prototype.getInput = function() {
      if (!this.$in) {
        this.$in = $(this["in"]);
      }
      return this.$in;
    };

    View.prototype.render = function() {
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    View.prototype.afterRender = function() {};

    View.prototype.close = function() {
      this.remove();
      this.unbind();
      return typeof this.onClose === "function" ? this.onClose() : void 0;
    };

    View.prototype.routeEvent = function(event) {
      var $link, url;
      $link = $(event.target);
      url = $link.attr('href');
      if ($link.attr('target') === '_blank' || typeof url === 'undefined' || url.substr(0, 4) === 'http' || url === '' || url === 'javascript:void(0)') {
        return true;
      }
      event.preventDefault();
      return this.routeLink(url);
    };

    View.prototype.routeLink = function(url) {
      return app.router.navigate(url, {
        trigger: true
      });
    };

    return View;

  })(Backbone.View);
  
}});

