

function initNotKnowServer() {
    // Loading templates
    $.ajax("test_templates/index.json", {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                try {
                    var response = $.parseJSON(jqXhr.responseText);
                    var templates = response.templates;
                    for (var i=0; i<templates.length; i++) {
                        var templ = templates[i];
                        loadTestTemplate(templ);
                    }
                } catch (exc) {
                    console.log("Error when loading templates ");
                    console.log(exc);
                }
            }
        },
        type: 'GET'});

}

function initKnowWhetherServer(found) {

    // Loading tests

//    console.log("Initializing know whether server");

    // If server isn't present, we can not log in
    if (!found) {
        $("#account-button").remove();
    }

    initPageLogic();

}

function findServer() {
    hasServer = false;
    for (var i=0; i<serverDetectListeners.length; i++) {
        serverDetectListeners[i](hasServer);
    }
}


$(document).ready(function() {
    // Initialize things before we know whether an advanced server exists or not
    initNotKnowServer();

    serverDetectListeners.push(function(found) {
        initKnowWhetherServer(found);
    });

    findServer();
});
