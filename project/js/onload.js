/* All the things to do when mado.html is loaded, event listeners are here because Chrome doesn't want JS in the HTML. */

window.onload = function() {
    /*
    * Shortcuts (JS files in alphabetical order).
    */

    /* app.js */
    exportButton = document.getElementById("export");
    newButton = document.getElementById("new");
    openButton = document.getElementById("open");
    printButton = document.getElementById("print");
    recentButton = document.getElementById("recent");
    saveButton = document.getElementById("save");
    saveAsButton = document.getElementById("save-as");
    windowTitle = document.getElementsByTagName("title")[0];

    /* drag-and-drop.js */
    documentSection = document.getElementById("document");
    
    /* editor.js */
    centerLine = document.getElementById("center-line-container");
    conversionDiv = document.getElementById("html-conversion");
    markdown = document.getElementById("markdown");   
    markdownContainer = document.getElementById("markdown-container");
    pasteZone = document.getElementById("paste-zone");
    
    /* footer.js */
    charsDiv = document.getElementById("character-nb");
    linkUrlSpan = document.getElementById("link-url");
    nameDiv = document.getElementById("doc-name");
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
    cancelImageButton = document.getElementById("cancel-image");
    galleriesButton = document.getElementById("galleries-button");
    imageButton = document.getElementById("image-button");
    imageDisplayer = document.getElementById("image-insertion-displayer");
    imageBox = document.getElementById("image-insertion-box");
    imageBrowser = document.getElementById("browse-image");
    altInput = document.getElementById("alt-input");
    titleInput = document.getElementById("title-input");

    /* link.js */
    cancelLinkButton = document.getElementById("cancel-link");
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
    madoFooter = document.getElementById("mado-footer");
    workspace = document.getElementById("workspace");
    switchToMD = document.getElementById("switch-md");
    switchToBoth = document.getElementById("switch-both");
    switchToHTML = document.getElementById("switch-html");
    switchButtons.push(switchToMD, switchToBoth, switchToHTML); // Wrapping the switch buttons in an array.

    /* window.js */
    cancelCloseButton = document.getElementById("cancel"); 
    closeDisplayer = document.getElementById("close-alert-displayer"); // The div that contains all the close divs.
    head = document.getElementsByTagName("head")[0]; // The "head" section of the main app.
    quitCloseButton = document.getElementById("quit");
    saveQuitCloseButton = document.getElementById("save-quit");
    saveState = document.getElementById("save-state");
    windowCloseContainer = document.getElementById("window-close");
    windowClose = document.getElementById("window-close-button");
    windowMax = document.getElementById("window-maximize");
    windowMin = document.getElementById("window-minimize");

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
    
                    fileEntry.file(
                        function(file) {
                            var reader = new FileReader();
                            reader.onload = function(e) { 
                                markdown.innerText = e.target.result;
                                markdownSaved = markdown.innerText;
                                contentChanged();  
                                nameDiv.innerHTML = fileName(fileEntry.fullPath) + "&nbsp;-";     
                                windowTitle.innerHTML = fileName(fileEntry.fullPath) + " - Mado";                
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

    $(printButton).on("click", function() {
        window.print();
    });

    Mousetrap.bind(['command+p', 'ctrl+p'], function(e) { window.print(); return false; }); // Ctrl+p = print.

    /* drag-and-drop.js */
    dragAndDropManager = new DnDManager("body", function(data) {
        openDraggedFile(data.items[0].webkitGetAsEntry());
    });

    /* editor.js */    
    setEditorSyntax(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none"; // On launch we just display the number of words.

    chrome.storage.local.get("firstLaunch", function(mado) { // Set text if it's the first launch.
        if (mado["firstLaunch"] == undefined) {
            markdown.innerHTML = firstMessage;
            chrome.storage.local.set({ "firstLaunch" : false });
        }
    });
    $(markdown).focus();
    $(markdown).on("input propertychange", function() {
    	contentChanged();
    });
    $(markdown).bind('paste', function(){ // What to do if the user pastes something.
        pasteContent();   
    });
    $(markdown).keydown(function(e){
        if (e.keyCode == 9) // The user press tab        
            e.preventDefault();
    });  

    $("#html-conversion").on("click", "a", function(e) {
        if (e.currentTarget.href.indexOf("chrome-extension://") != -1) { // Click on an inner link.
            e.preventDefault();
            if (e.currentTarget.hash != "" && $(e.currentTarget.hash).length != 0)
                $('#html-conversion').animate({scrollTop:$(e.currentTarget.hash).position().top}, 'slow');
        }
    });

    /* footer.js */
    $(charsDiv).on("click", counterSelection);
    $(wordsDiv).on("click", counterSelection);

    $("#html-conversion").on("mouseenter", "a", function(e) {
        if (e.currentTarget.href.indexOf("chrome-extension://") == -1)
            linkUrlSpan.innerHTML = e.currentTarget.href;
        else
            linkUrlSpan.innerHTML = e.currentTarget.hash;
        linkUrlSpan.className = "show";
    });

    $("#html-conversion").on("mouseleave", "a", function() {
        linkUrlSpan.className = "";
    });

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
    $(imageButton).on("mousedown", function() {
        changeContentHighlighted("mado-image");
    });

    $(imageBrowser).on("click", loadImage);
    $(galleriesButton).on("click", chooseGalleries);   

    $(altInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
           applyImage();
        else if (e.keyCode == 27) // The user press echap
            cancelImage();
        else
            modifyImage();
    });

    $(titleInput).keydown(function(e){
        if (e.keyCode == 9) { // The user press tab
            e.preventDefault();
            $(altInput).select();
        }
    })
    $(titleInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyImage();
        else if (e.keyCode == 27) // The user press echap
            cancelImage();
        else
            modifyImage();
    });

    $(cancelImageButton).on("click", cancelImage);

    /* link.js */
    $(linkButton).on("mousedown", function() {
        changeContentHighlighted("mado-link");
    });
    
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) { // Ctrl+k = link.
        changeContentHighlighted("mado-link");
        $(linkButton).click(); 
        return false; 
    }); 

    $(urlInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
           applyLink();
        else if (e.keyCode == 27) // The user press echap
            cancelLink();       
        else
            modifyLink();
    });

    $(hypertextInput).keydown(function(e){
        if (e.keyCode == 9)  {
            e.preventDefault();
            $(urlInput).select();
        }
    })
    $(hypertextInput).keyup(function(e){
        if (e.keyCode == 13) // The user press enter
            applyLink();
        else if (e.keyCode == 27) // The user press echap
            cancelLink();        
        else
            modifyLink();        
    });

    $(cancelLinkButton).on("click", cancelLink);

    /* More.js */
    $(settingsLine).on("click", function() { moreWindow("more/settings.html"); });
    $(qAndALine).on("click", function() { moreWindow("more/qanda.html"); });
    $(shortcutsLine).on("click", function() { moreWindow("more/shortcuts.html"); });
    $(aboutLine).on("click", function() { moreWindow("more/about.html"); });

    /* recentfiles.js */
    displayRecentFiles();

    /* scroll.js */

    $(markdownContainer).on ('mousewheel', function (e) {
        asyncScroll("markdown", e.originalEvent.deltaY);
    });

    $(conversionDiv).on ('mousewheel', function (e) {
        asyncScroll("HTML", e.originalEvent.deltaY);
    });
    /* stats.js 
    * Waiting for the prod.
    
    if (navigator.onLine)
        initStats();
    */

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

    /* window.js */
    determineFrame();

    $(quitCloseButton).on("click", quitCloseWindow);
    $(saveQuitCloseButton).on("click", saveQuitCloseWindow);

    $(windowClose).on("click", closeWindow);
    Mousetrap.bind(['command+w', 'ctrl+w'], function(e) { closeWindow(); return false; }); // Ctrl+w = close.

    $(windowMax).on("click", maximizeWindow);

    $(windowMin).on("click", minimizeWindow);    
}