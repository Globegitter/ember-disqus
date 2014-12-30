import Em from 'ember';
import defaultFor from 'ember-disqus/utils/default-for';

export default Em.Component.extend({
  attributeBindings: ['identifier:data-disqus-identifier'],
  classNames: ['disqus-comment-count'],
  tagName: 'span',

  /**
  An intermediary layout before Disqus renders the comment count in its place.

  @property layout
  */

  // layout: Em.Handlebars.compile('{{identifier}}'),

  /* Options */

  identifier: null,

  /**
  Assert that all required properties have been passed to this component and, if required, load the `count.js` script.

  @method setup
  */

  setup: function() {
    Em.assert('A Disqus identifier must be set on the {{disqus-comment-count}} component', this.get('identifier'));

    this.loadAPI('count');
  }.on('didInsertElement'),

});


