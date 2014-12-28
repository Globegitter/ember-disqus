import Em from 'ember';

export default {
  name: 'comment-count',

  initialize: function(container, app) {
    var loadCommentCountAPI, shortname;

    /* Defaults */

    var options = {
      enableCommentCount: false,
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

    app.register('disqusOptions:main', options, { instantiate: false });
    app.inject('component:disqus-comments', 'disqusOptions', 'disqusOptions:main');

    /* Add ability to show comment counts */

    if (options.get('enableCommentCount')) {
      window.disqus_shortname = shortname;

      Em.$.getScript('//' + shortname + '.disqus.com/count.js');

      // if (!options.get('lazyLoad')) {
      //   loadCommentCountAPI();
      // }

      Em.LinkView.reopen({
        attributeBindings: ['disqusIdentifier:data-disqus-identifier',
                            'disqusUrl:data-disqus-url'],
        disqusIdentifier: null,
        disqusUrl: null,

        // showCommentCount: Em.computed.or('disqusIdentifier', 'disqusUrl'),

        // addDisqusTag: function() {
        //   if (this.get('showCommentCount')) {
        //     this.set('href', this.get('href') + '#disqus_thread');
        //   }
        // }.observes('showCommentCount'),

        // loadAPI: function() {
        //   var documentIsReady = document.readyState === 'complete';

        //   if (window.DISQUSWIDGETS) {
        //     return;
        //   } else if (options.get('lazyLoad') && documentIsReady) {
        //     loadCommentCountAPI();
        //   } else {
        //     Em.run.debounce(this, this.loadAPI, 100);
        //   }
        // }.on('didInsertElement'),
      });
    }
  }
};
