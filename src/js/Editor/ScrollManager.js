function ScrollManager(firstZone, secondZone) {
    /* Variables */
    this.atTheBottom;
    this.firstZone = firstZone;
    this.secondZone = secondZone;
    this.lastFirstZoneHeight = firstZone[0].scrollHeight;

    /* Events */
    var t = this;
    firstZone.add(secondZone).on("scroll", function (e) {
        if ($(this).is(":hover")) {
            t.asyncScroll(this.id);
        }
    });
}

ScrollManager.prototype = {
    constructor: ScrollManager,
    asyncScroll: function(zone) {
        if (zone == this.firstZone[0].id) {
            this.secondZone.scrollTop((this.firstZone.scrollTop() / (this.firstZone[0].scrollHeight  - this.firstZone[0].offsetHeight)) * (this.secondZone[0].scrollHeight - this.secondZone[0].offsetHeight));
        } else {
            this.firstZone.scrollTop((this.secondZone.scrollTop() / (this.secondZone[0].scrollHeight  - this.secondZone[0].offsetHeight)) * (this.firstZone[0].scrollHeight - this.firstZone[0].offsetHeight));
        }

        if (this.firstZone.scrollTop() + this.firstZone[0].offsetHeight == this.firstZone[0].scrollHeight) {
            this.atTheBottom = true;
        } else {
            this.atTheBottom = false;
        }
    },

    checkZonesHeight: function(newHeight) {
        if (this.lastFirstZoneHeight < this.firstZone[0].scrollHeight) {
            if (this.atTheBottom) {
                this.firstZone.scrollTop(this.firstZone[0].scrollHeight - this.firstZone[0].offsetHeight);
                this.secondZone.scrollTop(this.secondZone[0].scrollHeight - this.secondZone[0].offsetHeight);
            }
        }
        this.lastFirstZoneHeight = this.firstZone[0].scrollHeight;

        if (markdown.clientHeight < markdown.scrollHeight) {
            $(centerLine).css("display", "none");
        } else {
            $(centerLine).css("display", "block");
        }
    }
}
