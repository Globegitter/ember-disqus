import Em from 'ember';
import setOnWindow from 'ember-disqus/utils/observers/set-on-window';

export default Em.Component.extend({
  elementId: 'disqus_thread',
  classNames: ['disqus_comments'],

  /* Options */

  categoryId: null,
  identifier: null,
  title: null,

  setShortname: setOnWindow('disqusOptions.shortname', 'disqus_shortname'),
  setIdentifier: setOnWindow('identifier', 'disqus_identifier'),
  setTitle: setOnWindow('title', 'disqus_title'),
  setCategoryId: setOnWindow('categoryId', 'disqus_category_id'),

  /* #disqus_thread must be on page before script is loaded */

  loadAPI: function() {
    var options = this.get('disqusOptions');
    var documentIsReady = document.readyState === 'complete';

    if (window.DISQUS) {
      return;
    } else if (!options.get('lazyLoad') || documentIsReady) {
      Em.$.getScript('//' + options.get('shortname') + '.disqus.com/embed.js');
    } else {
      Em.run.debounce(this, this.setupDisqus, 100);
    }
  },

  _updateDisqusComments: function() {
    if (window.DISQUS) {
      this.reset();
    } else {
      Em.run.debounce(this, this.reset, 100);
    }
  }.observes('categoryId', 'identifier', 'shortname', 'title'),

  setupDisqus: function() {
    var _this = this;
    var DISQUS = window.DISQUS;

    if (!DISQUS) {
      this.loadAPI();
    } else {
      // Em.run.scheduleOnce('afterRender', this, function() {
        var identifier = this.get('identifier');
        var title = this.get('title');

        Em.assert('A Disqus identifier must be set on the {{disqus-comments}} component to change routes', identifier);

        /* @ref 1 */

        DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = identifier;
            this.page.url = window.location.href;

            if (title) {
              this.page.title = title;
            }
          }
        });
      // });
    }
  }.on('didInsertElement'),

});

/* @ref
1 https://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites
*/
