"use strict";

var app = app || {};

app.Todo = Backbone.Model.extend({
	defaults: {
		title: "empty todo ...",
		completed: false,
		paused: false,
		important: false,
        position: {x: 0, y: 0}
	},

	start: function () {
	},

	pause: function() {

	},

	resume: function() {

	},

	end: function() {
	},

    change: function(attr, value) {
        var updates = {};
        updates[attr] = value;
        this.save(updates);
    }
});