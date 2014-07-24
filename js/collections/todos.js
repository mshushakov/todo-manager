"use strict";

var app = app || {};

app.TodosCollection = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Backbone.LocalStorage("todos-backbone")
});