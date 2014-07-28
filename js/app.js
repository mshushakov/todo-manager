var app = app || {};

//Stickers (as a plugin for jQuery)
app.Sticker = {
    isDragging: false,
    offset: {},
    position: {},

    init: function(elem, position) {
        this.$el = $(elem);
        this.position = position;
        this.$el.on("mousedown", $.proxy(this._dragStart, this));
        this.$el.on("mouseup", $.proxy(this._dragEnd, this));
        $("body").on("mousemove", $.proxy(this._dragMove, this));
        this._setPosition(position.x, position.y)
    },

    _dragStart: function(e) {
        e.preventDefault();
        if (!this.$el.data("draggable")) return;
        this.isDragging = true;
        this.$el.addClass("-dragging");
        this.offset.x = this.position.x - e.pageX;
        this.offset.y = this.position.y - e.pageY;
    },

    _dragMove: function(e) {
        if (this.isDragging) {
            this._setPosition(e.pageX + this.offset.x, e.pageY + this.offset.y);
        }
    },

    _dragEnd: function() {
        if (!this.$el.data("draggable")) return;
        this.isDragging = false;
        this.$el.removeClass("-dragging");
        this.$el.trigger("restick", [ this.position ]);
    },

    _setPosition: function(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.$el.css({
            transform: 'translate(' + x + 'px,'  + y + 'px)'
        });
    }
};

$.fn.stick = function(position) {
    return this.each(function() {
        Object.create(app.Sticker).init(this, position);
    });
};


//Timer with periods
app.Timer = {
    periods: [],

    init: function(periods) {
        this.periods = periods;
    },

    startPeriod: function() {
        this.periods.push({ start: Date.now() });
    },

    endPeriod: function() {
        this.periods[this.periods.length - 1].end = Date.now();
    },

    getTotalTime: function() {
        var total = 0;
        _.each(this.periods, function(period) {
            if (period.end) {
                total += period.end - period.start;
            } else {
                total += Date.now() - period.start;
            }
        });

        return total;
    }
}


//Application
$(function() {
    $("body").prepend(new app.AppView().render().el);
});