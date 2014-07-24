"use strict";

var app = app || {};

app.TodoView = Backbone.View.extend({
	tagName: "li",
    className: "todo",
    attributes: {
      "data-draggable": true
    },
	template: _.template($("#todo-template").html()),

    events: {
        "restick": "_restickTodo",
        "dblclick": "_editTodo",
        "blur .todo-input": "_updateTodo",
        "keypress .todo-input": "_keypressTodo"
    },

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
        this.$el.stick(this.model.get("position"));
		return this;
	},

    _restickTodo: function(e, position) {
        this.model.change("position", position);
    },

    _editTodo: function(e) {
        if (e) e.stopPropagation();
        this.$el.addClass("-editing").data("draggable", false);
        this.$(".todo-input").text(this.model.get("title")).prop("disabled", false).focus();
    },

    _keypressTodo: function(e) {
        if (e.keyCode == 13) $(e.target).trigger("blur");
    },

    _updateTodo: function(e) {
        var title = e.target.value;
        this.$el.removeClass("-editing").data("draggable", true);
        this.$(".todo-title").text(title)
        this.model.change("title", title);
    }
});