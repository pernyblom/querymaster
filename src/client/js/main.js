

function getGlobalFunction(name) {
    return window[name];
}

function loadTestTemplate(templateInfo) {

    $.ajax('test_templates/' + templateInfo.path + '/template.js', {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                try {
                    $.globalEval(jqXhr.responseText);
                    var constrFunc = getGlobalFunction(templateInfo.constructorName);
                    if (constrFunc) {
                        var template = new constrFunc(templateInfo.name);
                        template.initialize(function(err) {
                            if (!err) {
                                testTemplates.push(template);
                            } else {
                                console.log("Error when initializing template ");
                                console.log(templateInfo);
                                consoel.log(err);
                            }
                        });
                    } else {
                        console.log("Could not find template constructor " + templateInfo.constructorName);
                    }
                } catch (exc) {
                    console.log("Error when loading template ");
                    console.log(templateInfo);
                    console.log(exc);
                }
            }
        },
        type: 'GET'});
}

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

    console.log("Initializing know whether server");

    // If server isn't present, we can not log in
    if (!found) {
        $("#account-button").remove();
    }

    var $testsCollectionsPage = $("#tests-collections-page");
    $testsCollectionsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        currentTestInfo = null;

        var collections = testsData.testCollections;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + collection.name,
//                '<span class="ui-li-count">', collection.tests.length,
//                '</span>',
                '</h3>');
            htmlArr.push('<ul data-role="listview" >');
            for (var j=0; j<collection.tests.length; j++) {
                var test = collection.tests[j];
                htmlArr.push('<li><a class="start-test-button" href="#testing-page" data-test-collection-index="' + i + '" data-test-index="' + j + '" >' + test.name + '</a></li>')
            }
            htmlArr.push('</ul>');
            htmlArr.push('</div>');
        }

        var $testCollections = $("#test-collections");
        $testCollections.empty().append($(htmlArr.join("")));
        $testCollections.trigger("create");

        $testCollections.find(".start-test-button").on('click', function() {
            var collectionIndex = $(this).data('test-collection-index');
            var testIndex = $(this).data('test-index');
            console.log(collectionIndex + " " + testIndex);
            currentTestInfo = collections[collectionIndex].tests[testIndex];
//            console.log(currentTest);
        });

    });



    var $editTestsPage = $("#edit-tests-page");
    $editTestsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        var collections = testsData.testCollections;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + collection.name,
//                '<span class="ui-li-count">', collection.tests.length,
//                '</span>',
                '</h3>');
//            htmlArr.push('<ul data-role="listview" >');
            for (var j=0; j<collection.tests.length; j++) {
                var test = collection.tests[j];
                var testId = "test_cb_" + i + "_" + j;
                htmlArr.push(
//                    '<li>',
//                    '<a href="#" data-test-collection-index="' + i + '" data-test-index="' + j + '" >',
                    '<input type="checkbox" name="' + testId + '" id="' + testId + '" />',
                    '<label for="' + testId + '">', test.name, '</label>'
//                    '</a>',
//                    '</li>'
                )
            }
//            htmlArr.push('</ul>');
            htmlArr.push('</div>');
        }

        var $editTestsDiv = $("#edit-tests-div");
        $editTestsDiv.empty().append($(htmlArr.join("")));
        $editTestsDiv.trigger("create");
    });




    var $testingPage = $("#testing-page");

    function initTest() {
        console.log("Running test " + currentTestInfo);
        if (!currentTestInfo) {
            console.log("Test not available yet...");
            setTimeout(initTest, 500);
            return;
        }

        var testTemplate = findTemplate(currentTestInfo.template);
        if (!testTemplate) {
            console.log("Could not find a test template with name " + currentTestInfo.template + " in:");
            console.log(testTemplates);
            return;
        }

        var test = testTemplate.getTest(copyValueDeep(currentTestInfo.parameterValues));
        if (!test) {
            console.log("Unable to create test with parameters:");
            console.log(currentTestInfo.parameterValues);
            console.log("With test template: " + currentTestInfo.template);
            return;
        }

        var $testContent = $("#test-content");
        test.runTest($testContent, function(err) {

        });
    }

    $testingPage.on('pagebeforeshow', function(evt, data) {
        initTest();
    });

}

$(document).ready(function() {
    // Initialize things before we know whether an advanced server exists or not
    initNotKnowServer();

    serverDetectListeners.push(function(found) {
        initKnowWhetherServer(found);
    });

    findServer();
});
