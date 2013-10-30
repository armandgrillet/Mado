/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * Shortcuts (JS files in alphabetical order).
    */

    /* app.js */
    exportButton = document.getElementById("export");
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    
    /* editor.js */
    conversionDiv = document.getElementById("html-conversion");
    textarea = document.getElementById("markdown");   
    
    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    nameDiv = document.getElementById("doc-name");
    saveState = document.getElementById("save-state");
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
    galleriesButton = document.getElementById("galleries-button");
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

    /* styles.js */
    stylesButton = document.getElementById("style-tool");
    stylesDisplayer = document.getElementById("style-tool-displayer");
    homeRadio = document.getElementById("home-style");
    clinicRadio = document.getElementById("clinic-style");
    tramwayRadio = document.getElementById("tramway-style");

    /* viewswitch.js */
    workspace = document.getElementById("workspace");
    switchToMD = document.getElementById("switch-md");
    switchToBoth = document.getElementById("switch-both");
    switchToHTML = document.getElementById("switch-html");
    switchButtons.push(switchToMD, switchToBoth, switchToHTML); // Wrapping the switch buttons in an array.

    /*
    * Functions (JS files in alphabetical order).
    */

    /* app.js (with Mousetrap functions) */
    chrome.storage.local.get("tempFileEntry", function(mado) {  // If you're loading a file.
        if (mado["tempFileEntry"] != undefined) {
            chrome.fileSystem.restoreEntry(
                mado["tempFileEntry"],
                function (theFileEntry) {
                    fileEntry = theFileEntry;
                    chrome.storage.local.remove("tempFileEntry");

                    nameDiv.innerHTML = fileName(fileEntry.fullPath) + "&nbsp;|";
                    fileEntry.file(
                        function(file) {
                            var reader = new FileReader();
                            reader.onload = function(e) { 
                                textarea.value = e.target.result;
                                markdownSaved = e.target.result;
                                conversion();                       
                            };
                            reader.readAsText(file);
                        },
                        errorHandler
                    );
                }
            );          
        }
        else
            markdownSaved = undefined;
    });

    newDisplaySize(); // Set the class of the body.

    $(newButton).on("click", newWindow);
    Mousetrap.bind(['command+n', 'ctrl+n'], function(e) { newWindow(); return false; }); // Ctrl+n = new window.
    $(openButton).on("click", openFileButton);
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) { openFileButton(); return false; }); // Ctrl+o = open.
    $(saveButton).on("click", saveFile);
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) { saveFile(); return false; }); // Ctrl+s = save.
    $(saveAsButton).on("click", saveAsFile);
    Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], function(e) { saveAsFile(); return false; }); // Ctrl+shift+s = save as.
    $(exportButton).on("click", exportFileHTML);

    /* editor.js */    
    setEditorSyntax(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none"; // On launch we just display the number of words.

    $(textarea).on("input propertychange", conversion);

    /* footer.js */
    $(charsDiv).on("click", counterSelection);
    $(wordsDiv).on("click", counterSelection);

    /* help.js */ 
    Mousetrap.bind(['command+h', 'ctrl+h'], function(e) { $(helpButton).click(); return false; }); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    $(help).on("input propertychange", displayAnswers); // Launch the help when something is typed on the input.

    $(resultSwitch1).on("click", function() { switchResult("1"); });
    $(resultSwitch2).on("click", function() { switchResult("2"); });
    $(resultSwitch3).on("click", function() { switchResult("3"); });

    /* image.js */
    $(imageBrowser).on("click", loadImage);
    $(galleriesButton).on("click", chooseGalleries);
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
    
    /* stats.js */
    if (navigator.onLine)
        initStats();

    /* styles.js */
    getStyle();

    $(homeRadio).on("click", function() { setStyle("home"); });
    $(clinicRadio).on("click", function() { setStyle("clinic"); });
    $(tramwayRadio).on("click", function() { setStyle("tramway"); });

    /* viewswitch.js */
    initActivation(); // Initializing the workspace and the switch.
    setWindowResizing();

    // Getting and setting the click event on each of the switch buttons.
    $(switchToMD).on("click", function() { activate(this.id, "markdown-view"); });
    $(switchToBoth).on("click", function() { activate(this.id, "normal"); });
    $(switchToHTML).on("click", function() { activate(this.id, "conversion-view"); });
    Mousetrap.bind(['command+alt+left', 'ctrl+alt+left'], function(e) { switchShortcuts("left"); return false; }); // Ctrl+k = link.
    Mousetrap.bind(['command+alt+right', 'ctrl+alt+right'], function(e) { switchShortcuts("right"); return false; }); // Ctrl+k = link.
}