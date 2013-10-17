/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * SHORTCUTS (JS files in alphabetical order)
    */

    /* app.js */
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    exportButton = document.getElementById("export");

    /* editor.js */
    textarea = document.getElementById("markdown");   
    conversionDiv = document.getElementById("html-conversion");
    saveState = document.getElementById("save-state");

    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    wordsDiv = document.getElementById("word-nb");

    /* help.js */ 
    help = document.getElementById("help-input");
    helpButton = document.getElementById("help-button");
    helpDisplayer = document.getElementById("help-input-displayer");
    for (var i = 1; i <= 3; i++) {
        window["answer" + i] = document.getElementById("answer-" + i);
        window["example" + i] = document.getElementById("example-" + i);
        window["result" + i] = document.getElementById("result-" + i);
        window["resultSwitch" + i] = document.getElementById("result-switch-" + i);
    }
    resultsContainer = document.getElementById("help-results-container");

    /* image.js */
    imageButton = document.getElementById("image-button");
    imageDisplayer = document.getElementById("image-insertion-displayer");
    imageBox = document.getElementById("image-insertion-box");
    imageBrowser = document.getElementById("browse-image");
    imageStatus = document.getElementById("image-status");
    altInput = document.getElementById("alt-input");
    titleInput = document.getElementById("title-input");

    /* link.js */
    linkButton = document.getElementById("link-button");
    linkDisplayer = document.getElementById("link-insertion-displayer");
    urlInput = document.getElementById("url-input");
    hypertextInput = document.getElementById("hypertext-input");

    /* more.js */
    moreButton = document.getElementById("more-button");
    moreDisplayer = document.getElementById("more-displayer");
    moreBox = document.getElementById("more-container");
    settingsLine = document.getElementById("settings");
    qAndALine = document.getElementById("q-and-a");
    shortcutsLine = document.getElementById("shortcuts");
    aboutLine = document.getElementById("about");

    /* recentfiles.js */
    recentButton = document.getElementById("recent-button");   
    recentFilesDisplayer = document.getElementById("recent-files-displayer");
    recentFilesContainer = document.getElementById("recent-files-container");

    /* viewswitch.js */
    workspace = document.getElementById("workspace");
    switchToMD = document.getElementById("switch-md");
    switchToBoth = document.getElementById("switch-both");
    switchToHTML = document.getElementById("switch-html");
    switchButtons.push(switchToMD, switchToBoth, switchToHTML); // Wrapping the switch buttons in an array.

    /*
    * FUNCTIONS (JS files in alphabetical order).
    */

    /* app.js (with Mousetrap functions) */
    chrome.storage.local.get('loadedText', function(mado) { 
        if(mado.loadedText != undefined && mado.loadedText != " ")
            launchWithText(mado.loadedText);
        else
            markdownSaved = undefined;
    }); 

    newDisplaySize(); // Set the size of the font.

    $(newButton).on("click", function() { newWindow(); });
    Mousetrap.bind(['command+n', 'ctrl+n'], function(e) { newWindow(); return false; }); // Ctrl+n = new window.
    $(openButton).on("click", function() { openFileButton(); });
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) { openFileButton(); return false; }); // Ctrl+o = open.
    $(saveButton).on("click", function() { saveFile(); });
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) { saveFile(); return false; }); // Ctrl+s = save.
    $(saveAsButton).on("click", function() { saveAsFile(); });
    Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], function(e) { saveAsFile(); return false; }); // Ctrl+shift+s = save as.
    $(exportButton).on("click", function() { exportFileHTML(); });

    /* editor.js */    
    conversion(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none"; // On launch we just display the number of words.

    $(textarea).on("input propertychange", function () { conversion(); });

    /* footer.js */
    $(charsDiv).on("click", function() { counterSelection(); });
    $(wordsDiv).on("click", function() { counterSelection(); });

    /* help.js */ 
    Mousetrap.bind(['command+h', 'ctrl+h'], function(e) { $(helpButton).click(); return false; }); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    $(help).on("input propertychange", function () { displayAnswers(); }); // Launch the help when something is typed on the input.

    $(resultSwitch1).on("click", function() { switchResult("1"); });
    $(resultSwitch2).on("click", function() { switchResult("2"); });
    $(resultSwitch3).on("click", function() { switchResult("3"); });

    /* image.js */
    $(imageBrowser).on("click", function() { loadImage(); });
    $(altInput).keyup(function(e){
        if(e.keyCode == 13) // The user press enter
           applyImage();
    });
    $(titleInput).keyup(function(e){
        if(e.keyCode == 13) // The user press enter
            applyImage();
    });
    $(altInput).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(imageButton).click();
    });
    $(titleInput).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(imageButton).click();
    });
    
    /* link.js */
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) { $(linkButton).click(); return false; }); // Ctrl+k = link.

    $(urlInput).keyup(function(e){
        if(e.keyCode == 13) // The user press enter
           applyLink();
    });
    $(hypertextInput).keyup(function(e){
        if(e.keyCode == 13) // The user press enter
            applyLink();
    });
    $(urlInput).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(linkButton).click();
    });
    $(hypertextInput).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(linkButton).click();
    });

    /* More.js */
    $(settingsLine).on("click", function() { moreWindow("more/settings.html"); });
    $(qAndALine).on("click", function() { moreWindow("more/qanda.html"); });
    $(shortcutsLine).on("click", function() { moreWindow("more/shortcuts.html"); });
    $(aboutLine).on("click", function() { moreWindow("more/about.html"); });

    /* recentfiles.js */
    displayRecentFiles();
    
    /* viewswitch.js */
    initActivation(); // Initializing the workspace and the switch.

    // Getting and setting the click event on each of the switch buttons.
    $(switchToMD).on("click", function() { activate(this.id, "markdown-view"); });
    $(switchToBoth).on("click", function() { activate(this.id, "normal"); });
    $(switchToHTML).on("click", function() { activate(this.id, "conversion-view"); });
    Mousetrap.bind(['command+alt+left', 'ctrl+alt+left'], function(e) { switchShortcuts("left"); return false; }); // Ctrl+k = link.
    Mousetrap.bind(['command+alt+right', 'ctrl+alt+right'], function(e) { switchShortcuts("right"); return false; }); // Ctrl+k = link.
}