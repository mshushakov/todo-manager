"use strict";

var app = app || {};

app.AppView = Backbone.View.extend({
    tagName: "ul",
    id: "todos",

    events: {
        "dblclick": "_createTodo"
    },

    initialize: function() {
        app.Todos = new app.TodosCollection();
        app.Todos.fetch();

        this.listenTo(app.Todos, 'add', this.addTodoAndEdit);
    },

    render: function() {
        app.Todos.each(this.addTodo, this);
        return this;
    },

    addTodo: function(todo) {
        this.$el.append(new app.TodoView({model: todo}).render().el);
    },

    addTodoAndEdit: function(todo) {
        var view = new app.TodoView({model: todo});
        this.$el.append(view.render().el);
        view._editTodo();
    },

    _createTodo: function(e) {
        e.preventDefault();
        app.Todos.add({
            title: "",
            position: { x: e.clientX - 125, y: e.clientY }
        });
    }
});
