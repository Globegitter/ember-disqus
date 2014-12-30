import Em from 'ember';

var loadedAPIs = Em.Object.create({});

export default {
  name: 'comment-count',

  initialize: function(container, app) {
    var initializer = this;
    var shortname;

    /* Defaults */

    var options = {
      lazyLoad: true,
      shortname: null
    };

    /* Override defaults */

    for (var option in app.disqus) {
      options[option] = app.disqus[option];
    }

    options = Em.Object.create(options);
    shortname = options.get('shortname');

    Em.assert('You must define APP.disqus.shortname in your config/environment.js file', shortname);

    window.disqus_shortname = shortname;

    var loadAPI = function(fileName) {
      var assertion = fileName === 'embed' ? 'DISQUS' : 'DISQUSWIDGETS';
      var documentIsReady = document.readyState === 'complete';
      var options = this.get('disqusOptions');

      if (window[assertion]) {
        return;
      } else if ((!options.get('lazyLoad') || documentIsReady) && !loadedAPIs.get(fileName)) {
          Em.$.getScript('//' + options.get('shortname') + '.disqus.com/' + fileName + '.js');
          loadedAPIs.set(fileName, true);
      } else {
        Em.run.debounce(this, this.loadAPI, fileName, 100);
      }
    };

    app.register('disqusOptions:main', options, { instantiate: false });
    app.register('disqusAPILoader:main', loadAPI, { instantiate: false });

    ['disqus-comments', 'disqus-comment-count'].forEach(function(name) {
      app.inject('component:' + name, 'disqusOptions', 'disqusOptions:main');
      app.inject('component:' + name, 'loadAPI', 'disqusAPILoader:main');
    });

    /* Add ability to show comment counts */

    Em.LinkView.reopen({
      attributeBindings: ['disqusIdentifier:data-disqus-identifier'],
      classNameBindings: ['showCommentCount:disqus-comment-count'],
      disqusIdentifier: null,

      /* Because we can't inject into the link view... */

      disqusOptions: options,
      loadAPI: loadAPI,

      checkForDisqus: function() {
        if (this.get('disqusIdentifier')) {
          this.loadAPI('count');
        }
      }.on('didInsertElement'),
    });
  }
};
