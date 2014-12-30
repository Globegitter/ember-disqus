import Em from 'ember';
import defaultFor from 'ember-disqus/utils/default-for';
import setOnWindow from 'ember-disqus/utils/observers/set-on-window';

export default Em.Component.extend({
  attributeBindings: ['identifier:data-disqus-identifier'],
  classNames: ['disqus-comment-count'],
  debouncePeriod: 100,
  tagName: 'span',
  layout: Em.Handlebars.compile('{{identifier}}'),

  /* Options */

  identifier: null,

  /* #disqus_thread must be on page before script is loaded */

  setup: function() {
    Em.assert('A Disqus identifier must be set on the {{disqus-comment-count}} component', this.get('identifier'));

    this.loadAPI('count');
  }.on('didInsertElement'),

});


