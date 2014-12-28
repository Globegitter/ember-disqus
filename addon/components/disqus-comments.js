import Em from 'ember';
import setOnWindow from 'ember-disqus/utils/observers/set-on-window';

export default Em.Component.extend({
  elementId: 'disqus_thread',
  classNames: ['comments'],

  /* Options */

  categoryId: null,
  delayLoading: true,
  identifier: null,
  shortname: null,
  title: null,

  setShortname: setOnWindow('shortname', 'disqus_shortname'),
  setIdentifier: setOnWindow('identifier', 'disqus_identifier'),
  setTitle: setOnWindow('title', 'disqus_title'),
  setCategoryId: setOnWindow('categoryId', 'disqus_category_id'),

  /* #disqus_thread must be on page before script is loaded */

  setupDisqus: function() {
    var delayLoading = this.get('delayLoading');
    var documentReady = document.readyState = 'complete';
    var shortname = this.get('shortname');

    if (DISQUS) {
      return;
    } else if (!delayLoading || documentReady && shortname) {
      Em.$.getScript('//' + shortname + '.disqus.com/embed.js');
    } else {
      Em.run.debounce(this, this.setupDisqus, 100);
    }
  }.on('didInsertElement'),

  updateDisqusComments: function() {
    if (DISQUS) {
      this.reset();
    } else {
      Em.run.debounce(this, this.reset, 100);
    }
  }.observes('categoryId', 'identifier', 'shortname', 'title'),

  reset: function() {
    var _this = this;

    /* @ref 1 */

    console.log('Reset pre');

    Em.run.scheduleOnce('afterRender', this, function() {
      var identifier = this.get('identifier');
      var title = this.get('title');

      console.log('RESET');

      Em.assert('A Disqus identifier must be set on the {{disqus-comment}} component', identifier);

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
    });
  }.observes('identifier'),
});

/* @ref
1 https://help.disqus.com/customer/portal/articles/472107-using-disqus-on-ajax-sites
*/

/**
Load Disqus comment count to add to each post preview
*/

// App.DisqusCommentCount = Em.Mixin.create({

//   setupCommentCount: function() {
//     var disqusShortname = App.DisqusOptions.get('shortname');

//     window.disqus_shortname = disqusShortname;

//     Em.run.later(this, function() {
//       /* * * DON'T EDIT BELOW THIS LINE * * */
//       var s = document.createElement('script'); s.async = true;
//       s.type = 'text/javascript';
//       s.src = '//' + disqusShortname + '.disqus.com/count.js';
//       (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
//     }, 1000)
//   }.on('didInsertElement'),
// });

// App.PostsView.reopen(
//   App.DisqusCommentCount, {

// });

// Em.LinkView.reopen({

//   addDisqusTag: function() {
//     var commentCount = this.get('commentCount');

//     if (commentCount) {
//       var isLinkToPost = this.get('isLinkToPost');
//       var href = this.get('href');
//       var disqusTag = '#disqus_thread';

//       this.set('href', href + disqusTag);
//     }
//   }.on('willInsertElement'),
// });
