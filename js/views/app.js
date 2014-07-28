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
        this.listenTo(app.Todos, 'change:pause', this._modelChangeHandler);
    },

    render: function() {
        app.Todos.each(this.addTodo, this);
        return this;
    },

    addTodo: function(todo) {
        this.$el.append(new app.TodoView({model: todo}).render().el);
    },

    addTodoAndEdit: function(todo) {
        todo.start();
        var view = new app.TodoView({model: todo});
        this.$el.append(view.render().el);
        view.switchToEdit();
    },

    pauseAll: function() {
        app.Todos.each(function(model) { model.pause() });
    },

    _createTodo: function(e) {
        e.stopPropagation();
        this.pauseAll();
        app.Todos.add({
            title: "",
            position: { x: e.clientX - 125, y: e.clientY }
        });
    },

    _modelChangeHandler: function(model) {
        if (!model.get("pause")) {
            app.Todos.each(function(m) {
                if (m !== model) m.pause();
            });
        }
    }
});
