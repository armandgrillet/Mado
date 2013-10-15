function validate() {
    if(document.getElementById("simple").checked)
        chrome.storage.sync.set({"theme" : "simple"}, function() {});
    else if(document.getElementById("medium").checked)
        chrome.storage.sync.set({"theme" : "medium"}, function() {});
    else if(document.getElementById("modern").checked)
        chrome.storage.sync.set({"theme" : "modern"}, function() {});
}

onload = function() {
    //Check the good option
    var check = chrome.storage.sync.get("theme", function(name) {
        console.log(name.theme);
        if(name.theme == "simple")
            document.getElementById("simple").checked = true;
        else if(name.theme == "medium")
            document.getElementById("medium").checked = true;
        else if(name.theme == "modern")
            document.getElementById("modern").checked = true;        
    }); /* Find your theme */
    
    //Event listeners
    document.getElementById("validation").addEventListener("click", validate); // Save the new configuration
}