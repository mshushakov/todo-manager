"use strict";

var app = app || {};

app.Todo = Backbone.Model.extend({
    _timer: [],

    defaults: {
		title: "empty todo ...",
		completed: false,
		paused: false,
		important: false,
        position: {x: 0, y: 0},
        periods: []
	},

    initialize: function() {
        this._timer = Object.create(app.Timer);
        this._timer.init(this.get("periods"));
    },

	start: function () {
        this._timer.startPeriod();
        this.change("periods", this._timer.periods);
        this.change("pause", false);
        this.change("completed", false);;
	},

	pause: function() {
        if (!this.get("pause")) {
            this._timer.endPeriod();
            this.change("periods", this._timer.periods);
            this.change("pause", true);
        }
	},

	resume: function() {
        this.start();
	},

	end: function() {
        this.pause();
        this.change("completed", true);
	},

    change: function(attr, value) {
        var updates = {};
        updates[attr] = value;
        this.save(updates);
    },

    getTime: function() {
        return this._timer.getTotalTime();
    }
})