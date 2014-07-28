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
        "blur .todo-input": "_updateTodo",
        "keypress .todo-input": "_keypressTodo",

        "click .icon-complete": "_iconClickHandler",
        "click .icon-pause": "_iconClickHandler",
        "click .icon-resume": "_iconClickHandler",

        "dblclick": "switchToEdit"
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this._updateTimer);
        this.listenTo(this.model, 'change:pause', this.switchState);
        this.listenTo(this.model, 'change:completed', this.switchState);
        this._time = this.model.getTime();
    },

	render: function() {
		this.$el.html(this.template({ title: this.model.get("title") }));
        this.$el.stick(this.model.get("position"));

        this.switchState()

		return this;
	},

    switchToEdit: function(e) {
        if (e) e.stopPropagation();
        this.$el.addClass("-editing").data("draggable", false);
        this.$(".todo-input").text(this.model.get("title")).prop("disabled", false).focus();
    },

    switchState: function() {
        if (this.model.get("completed")) {
            this.$(".timer").html(this._msToTime(this._time));
            this.$el.removeClass("-in-progress").addClass("-completed");
            clearInterval(this._timer);
        }
        else if(this.model.get("pause")) {
            this.$(".timer").html(this._msToTime(this._time));
            this.$el.removeClass("-in-progress");
            clearInterval(this._timer);
        }
        else {
            this.$el.removeClass("-completed").addClass("-in-progress");
            this.$(".timer").html(this._msToTime(this._time));
            this._timer = setInterval($.proxy(this._showTime, this), 1000);
        }
    },

    _iconClickHandler: function(e) {
        if ($(e.target).hasClass("icon-complete")) {
            this.model.end();
        }
        else if ($(e.target).hasClass("icon-pause")) {
            this.model.pause();
        }
        else if ($(e.target).hasClass("icon-resume")) {
            this.model.resume();
        }
    },

    _restickTodo: function(e, position) {
        this.model.change("position", position);
    },

    _keypressTodo: function(e) {
        if (e.keyCode == 13) $(e.target).trigger("blur");
    },

    _updateTodo: function(e) {
        var title = e.target.value;
        this.$el.removeClass("-editing").data("draggable", true);
        this.$(".todo-title").text(title)
        this.model.change("title", title);
    },

    _updateTimer: function(model) {
        this._time = this.model.getTime();
    },

    _showTime: function() {
        this._time += 1000;
        this.$(".timer").html(this._msToTime(this._time));
    },

    _msToTime: function(duration) {
        var minutes = parseInt((duration/(1000*60))%60),
            hours = parseInt((duration/(1000*60*60))%24),
            seconds = parseInt((duration/(1000))%60)

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }
});