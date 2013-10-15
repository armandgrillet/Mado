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
    charsDiv = document.getElementById("character-nb");
    wordsDiv = document.getElementById("word-nb");
    saveState = document.getElementById("save-state");

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

    /* link.js */
    linkButton = document.getElementById("link-button");
    linkDisplayer = document.getElementById("link-insertion-displayer");
    urlInput = document.getElementById("url-input");
    hypertextInput = document.getElementById("hypertext-input");

    /* viewswitch.js */
    workspace = document.getElementById("workspace");
    switchToMD = document.getElementById("switch-md");
    switchToBoth = document.getElementById("switch-both");
    switchToHTML = document.getElementById("switch-html");
    switchButtons.push(switchToMD, switchToBoth, switchToHTML); // Wrapping the switch buttons in an array.


    /*
    * FUNCTIONS (JS files in alphabetical order)
    */

    /* app.js (with Mousetrap functions) */

    chrome.storage.sync.get('loadedText', function(mado) { 
        if(mado.loadedText != " " && mado.loadedText != undefined)
            launchWithText(mado.loadedText);
    }); 

    newButton.addEventListener("click", newWindow);
    Mousetrap.bind(['command+n', 'ctrl+n'], function(e) { newWindow(); return false;}); // Ctrl+n = new window.
    openButton.addEventListener("click", openFile);
    Mousetrap.bind(['command+o', 'ctrl+o'], function(e) { openFile(); return false;}); // Ctrl+o = open.
    saveButton.addEventListener("click", saveFile);
    Mousetrap.bind(['command+s', 'ctrl+s'], function(e) { saveFile(); return false;}); // Ctrl+s = save.
    saveAsButton.addEventListener("click", saveAsFile);
    Mousetrap.bind(['command+shift+s', 'ctrl+shift+s'], function(e) { saveAsFile(); return false;}); // Ctrl+shift+s = save as.
    exportButton.addEventListener("click", exportFile);

    /* autosize.js */
    $(textarea).autosize(); // Apply autosize.js to set a dynamic height for the markdown textarea.

    /* editor.js */    
    conversion(); // A conversion is made when the window is opened.
    charsDiv.style.display = "none";

    textarea.addEventListener("input", conversion); // Conversion when the textarea is changed.
    charsDiv.addEventListener("click", counterSelection);
    wordsDiv.addEventListener("click", counterSelection);

    /* help.js */ 
    Mousetrap.bind(['command+h', 'ctrl+h'], function(e) { $(helpButton).click(); return false;}); // Ctrl+h = display the help.
    $(help).keyup(function(e){
        if(e.keyCode == 27) // The user press echap
            $(helpButton).click();
    });
    help.addEventListener("keyup", displayAnswers); // Launch the help when something is typed on the input.
    resultSwitch1.addEventListener("click", function() { switchResult("1"); }, false);
    resultSwitch2.addEventListener("click", function() { switchResult("2"); }, false);
    resultSwitch3.addEventListener("click", function() { switchResult("3"); }, false);

    /* link.js */
    Mousetrap.bind(['command+k', 'ctrl+k'], function(e) { $(linkButton).click(); return false;}); // Ctrl+k = link.

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

    /* viewswitch.js */
    // Initializing the workspace and the switch.
    initActivation();
    // Getting and setting the click event on each of the switch buttons.
    document.getElementById("switch-md").addEventListener("click", function() { activate(this.id, "markdown-view");}, false);
    document.getElementById("switch-both").addEventListener("click", function() { activate(this.id, "normal");}, false);
    document.getElementById("switch-html").addEventListener("click", function() { activate(this.id, "conversion-view");}, false);
}