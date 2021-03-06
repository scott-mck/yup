Yup.Views.UserEdit = Backbone.View.extend({
  template: JST['users/edit'],
  id: 'user-edit',

  initialize: function () {
    this.listenTo(this.model, "sync", this.render);
  },

  render: function () {
    var content = this.template({ user: this.model });
    this.$el.html(content);
    return this;
  },
});
