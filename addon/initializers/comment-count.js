import Em from 'ember';

/**
Private variable to keep track of which Disqus APIs have been loaded.

@todo Need a better way of doing this
*/

var loadedAPIs = Em.Object.create({});

/* Make the initialize function exportable for unit tests */

export function initialize(container, app) {
  var shortname;

  /* Default options */

  var options = {
    lazyLoad: true,
    shortname: null
  };

  /* Override default options with those set by the developer */

  for (var option in app.disqus) {
    options[option] = app.disqus[option];
  }

  options = Em.Object.create(options);
  shortname = options.get('shortname');

  Em.assert('You must define APP.disqus.shortname in your config/environment.js file', shortname);

  /* Set the shortname here to support all components */

  window.disqus_shortname = shortname;

  /* Define the function used by all views/components to load the Disqus API files */

  var loadAPI = function(fileName) {

    /* Assertion is the property we will check for on the window to see if the specific part of the Disqus API has already been loaded */

    // Removed in favor of loadedAPIs property - TBD
    // var assertion = fileName === 'embed' ? 'DISQUS' : 'DISQUSWIDGETS';

    /* Check to see is everything else in the app has loaded for lazy loading */

    var documentIsReady = document.readyState === 'complete';
    var options = this.get('disqusOptions');

    if (loadedAPIs.get(fileName)) {

      /* If window has the related Disqus property, don't load anything... */

      return;
    } else if (!options.get('lazyLoad') || documentIsReady) {

      /* ... Else if we're ready to load the Disqus API, load it... */

      Em.$.getScript('//' + options.get('shortname') + '.disqus.com/' + fileName + '.js');
      loadedAPIs.set(fileName, true); // So we know API has loaded
    } else {

      /* ... Else wait a small period and check again to see if the Ember app has fully loaded. */

      Em.run.debounce(this, this.loadAPI, fileName, 100);
    }
  };

  /* Inject options and loadAPI method into components */

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

    /* Because we can't inject into the link view, add the above property and method manually */

    disqusOptions: options,
    loadAPI: loadAPI,

    /* Only load the count.js API if the `disqusIdentifier` property is added */

    checkForDisqus: function() {
      if (this.get('disqusIdentifier')) {
        this.loadAPI('count');
      }
    }.on('didInsertElement'),
  });
}

export default {
  name: 'comment-count',

  initialize: initialize
};
