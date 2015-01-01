function RecentFilesManager(app) {
    /* Outlets */
    this.recentButton = $("#recent-button");
    this.recentFilesDisplayer = $("#recent-files-displayer");
    this.recentFilesContainer = $("#recent-files-container");

    /* Events */
    $(document).click($.proxy(function(e) {
        if ($(e.target).closest("#recent-button").length) {
            this.recentFilesDisplayer.toggleClass("hidden");
        } else if (!this.recentFilesDisplayer.hasClass("hidden") && !$(e.target).closest("#recent-files-container").length) {
            this.recentFilesDisplayer.addClass("hidden"); // This is not a cancellation.
        }
    }, this));
}

RecentFilesManager.prototype = {
    constructor: RecentFilesManager
}
