import Em from 'ember';

export default Em.Route.extend({

  model: function(params) {
    return params;
  },

  setupController: function(controller, model) {
    controller.set('title', model.id);
  }

});
