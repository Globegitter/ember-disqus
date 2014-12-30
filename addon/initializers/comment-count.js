import Em from 'ember';

export default {
  name: 'comment-count',

  initialize: function(container, app) {
    var shortname;

    /* Defaults */

    var options = {
      // enableCommentCount: false,
      lazyLoad: true,
      shortname: null,
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
      var options = this.get('disqusOptions');
      var documentIsReady = document.readyState === 'complete';
      var assertion = fileName === 'embed' ? 'DISQUS' : 'DISQUSWIDGETS';

      if (window[assertion]) {
        return;
      } else if (!options.get('lazyLoad') || documentIsReady) {
        Em.$.getScript('//' + options.get('shortname') + '.disqus.com/' + fileName + '.js');
      } else {
        Em.run.debounce(this, this.loadAPI, fileName, assertion, this.get('debouncePeriod'));
      }
    };

    app.register('disqusOptions:main', options, { instantiate: false });
    app.register('disqusAPILoader:main', loadAPI, { instantiate: false });

    ['component:disqus-comments',
     'component:disqus-comment-count',
     'view:linkTo'].forEach(function(name) {
      app.inject(name, 'disqusOptions', 'disqusOptions:main');
      app.inject(name, 'loadAPI', 'disqusAPILoader:main');
    });

     console.log(app);

    /* Add ability to show comment counts */

    if (options.get('enableCommentCount')) {

      // Em.$.getScript('//' + shortname + '.disqus.com/count.js');

      Em.LinkView.reopen({
        attributeBindings: ['disqusIdentifier:data-disqus-identifier'],
        classNameBindings: ['showCommentCount:disqus-comment-count'],
        disqusIdentifier: null,

        disqusOptions: options,
        loadAPI: loadAPI,

        testdyif: function() {
          if (this.get('disqusIdentifier')) {
            this.loadAPI('count');
          }
        }.on('didInsertElement'),
      });
    }
  }
};
