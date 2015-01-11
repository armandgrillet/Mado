function ScrollManager(firstZone, secondZone) {
    /* Outlets */
    this.centerLine = $("#center-line-container");

    /* Variables */
    this.atTheBottom = undefined; // True if the user is at the end of the document.
    this.firstZone = firstZone; // Zone 1 with synced scrolling.
    this.secondZone = secondZone; // Zone 2 with synced scrolling.
    this.lastFirstZoneHeight = firstZone[0].scrollHeight; // Save of the first zone height.

    /* Events */
    var t = this;
    firstZone.add(secondZone).on("scroll", function (e) { // On scroll in one of the two zones.
        if ($(this).is(":hover")) {
            t.asyncScroll(this.id);
        }
    });
}

ScrollManager.prototype = {
    constructor: ScrollManager,

    /* Apply a scroll on the zone not scrolled so that there is a scroll in the two zones, depending on the height of each zone. */
    asyncScroll: function(zone) {
        if (zone == this.firstZone[0].id) {
            this.secondZone.scrollTop((this.firstZone.scrollTop() / (this.firstZone[0].scrollHeight - this.firstZone[0].offsetHeight)) * (this.secondZone[0].scrollHeight - this.secondZone[0].offsetHeight));
        } else {
            this.firstZone.scrollTop((this.secondZone.scrollTop() / (this.secondZone[0].scrollHeight - this.secondZone[0].offsetHeight)) * (this.firstZone[0].scrollHeight - this.firstZone[0].offsetHeight));
        }

        if (this.firstZone.scrollTop() + this.firstZone[0].offsetHeight == this.firstZone[0].scrollHeight) {
            this.atTheBottom = true;
        } else {
            this.atTheBottom = false;
        }
    },

    /* Automatic scroll when writing. */
    checkZonesHeight: function() {
        if (this.lastFirstZoneHeight < this.firstZone[0].scrollHeight) { // New height.
            if (this.atTheBottom) { // We are at the bottom.
                this.firstZone.scrollTop(this.firstZone[0].scrollHeight - this.firstZone[0].offsetHeight);
                this.secondZone.scrollTop(this.secondZone[0].scrollHeight - this.secondZone[0].offsetHeight);
            }
        }
        this.lastFirstZoneHeight = this.firstZone[0].scrollHeight; // Update the height saved.
    }
};
