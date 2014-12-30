import Em from 'ember';
import defaultFor from 'ember-disqus/utils/default-for';
import setOnWindow from 'ember-disqus/utils/observers/set-on-window';

export default Em.Component.extend({
  elementId: 'disqus_thread',
  classNames: ['disqus_comments'],

  /* Options */

  categoryId: null,
  identifier: null,
  title: null,

  /* #disqus_thread must be on page before script is loaded */

  setup: function() {
    var DISQUS = window.DISQUS;

    Em.assert('A Disqus identifier must be set on the {{disqus-comments}} component to change routes', this.get('identifier'));

    if (!window.DISQUS) {
      this.loadAPI('embed');
    } else {
      this.reset();
    }
  }.on('didInsertElement'),

  reset: function(identifier, title) {
    Em.run.debounce(this, function() {
      identifier = defaultFor(identifier, this.get('identifier'));
      title = defaultFor(title, this.get('title'));

      /* @ref https://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites */

      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = window.location.href;

          if (title) {
            this.page.title = title;
          }
        }
      });
    }, this.get('debouncePeriod'));
  },

  _setCategoryId: setOnWindow('categoryId', 'disqus_category_id'),
  _setIdentifier: setOnWindow('identifier', 'disqus_identifier'),
  _setShortname: setOnWindow('disqusOptions.shortname', 'disqus_shortname'),
  _setTitle: setOnWindow('title', 'disqus_title'),

  _updateDisqusComments: function() {
    if (window.DISQUS) {
      Em.run.debounce(this, this.reset, this.get('debouncePeriod'));
    }
  }.observes('categoryId', 'identifier', 'shortname', 'title'),

});


