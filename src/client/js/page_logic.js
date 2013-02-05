
function initTestsPageLogic(serverFound) {

    var $testsCollectionsPage = $("#tests-collections-page");
    $testsCollectionsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        currentTestInfo = null;

        var collections = testsData.testCategories;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + collection.name,
                '</h3>');
            htmlArr.push('<ul data-role="listview" >');
            for (var j=0; j<collection.testInfos.length; j++) {
                var test = collection.testInfos[j];
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
            currentTestInfo = collections[collectionIndex].testInfos[testIndex];
//            console.log(currentTest);
        });

    });
}

function initEditTestsPageLogic(serverFound) {

    var $editTestsPage = $("#edit-tests-page");
    $editTestsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        htmlArr.push(
            '<h4>Test categories:</h4>'
        );

        var collections = testsData.testCategories;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + collection.name,
                '</h3>'
            );
            htmlArr.push(
                '<a data-role="button" data-icon="gear" data-inline="true" data-mini="true" href="#" >Rename "' + collection.name + '"</a>',
                '<a data-role="button" data-icon="gear" data-inline="true" data-mini="true" href="#" >Delete "' + collection.name + '"</a>'
            );
            htmlArr.push(
                '<h4>Tests in category "' + collection.name + '":</h4>'
            );
            for (var j=0; j<collection.testInfos.length; j++) {
                var test = collection.testInfos[j];
                var testId = "test_cb_" + i + "_" + j;
                htmlArr.push(
                    '<input type="checkbox" name="' + testId + '" id="' + testId + '" />',
                    '<label for="' + testId + '">', test.name, '</label>'
                )
            }
            htmlArr.push('</div>');
        }

        var $editTestsDiv = $("#edit-tests-div");
        $editTestsDiv.empty().append($(htmlArr.join("")));
        $editTestsDiv.trigger("create");
    });


}

function initTestingPageLogic(serverFound) {
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

function initNewTestPageLogic(serverFound) {

    var $newTestPage = $("#new-test-page");

    $newTestPage.on('pagebeforeshow', function(evt, data) {


        var $newTestContent = $("#new-test-content");
        $newTestContent.empty();


        var htmlArr = [];


        // Template select
        htmlArr.push(
            '<div data-role="fieldcontain">',
            '<label for="new-test-template-select" >Template</label>',
            '<select id="new-test-template-select">'
        );

        for (var i=0; i<testTemplates.length; i++) {
            var t = testTemplates[i];
            htmlArr.push('<option value="' + t._constructorName + '">', t.displayName, '</option>')
        }

        htmlArr.push('</select>', '</div>');


        $newTestContent.append($(htmlArr.join("")));

        $newTestContent.trigger("create");


        var $newTestNextButton = $newTestPage.find("#new-test-next-button");

        $newTestNextButton.click(function() {
            var template = $("#new-test-template-select").val();

            testInfoToEdit = new TestInfo();
            testInfoToEdit.template = template;

        });

    });


}



function initEditTestParametersPageLogic(serverFound) {

    var $editTestParametersPage = $("#edit-test-parameters-page");

    $editTestParametersPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        function addParamsHtml(params, htmlArr) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                param.getHtml(htmlArr);
            }
        }

        var templateParams = [];
        var templateDataParams = [];
        var testParams = [];

        if (testInfoToEdit) {
            console.log('Using template ' + testInfoToEdit.template);

            var template = findTemplate(testInfoToEdit.template);
            if (template) {
                templateParams = template.getParameters();
                templateDataParams = template.getDataParameters();

                addParamsHtml(templateParams, htmlArr);
                addParamsHtml(templateDataParams, htmlArr);

                // Creating a dummy test to get the parameters
                var test = template.getTest({});
                testParams = test.getParameters();
                addParamsHtml(testParams, htmlArr);

            } else {
                console.log('Could not find template ' + testInfoToEdit.template);
            }
        } else {
            htmlArr.push('Could not edit parameters. Template not selected.');
        }

        // Category select
        htmlArr.push(
            '<div data-role="fieldcontain">',
            '<label for="new-test-category-select" >Category</label>',
            '<select id="new-test-category-select">'
        );

        var collections = testsData.testCategories;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<option value="' + collection.name + '">', collection.name, '</option>')
        }

        htmlArr.push('</select>', '</div>');

        var $content = $editTestParametersPage.find("#edit-test-parameters-content");
        $content.empty();

        $content.append($(htmlArr.join("")));

        // Initialize all the params in the DOM
        function initializeParamsInDom(params) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                param.initializeInDom($content);
            }
        }
        initializeParamsInDom(templateParams);
        initializeParamsInDom(templateDataParams);
        initializeParamsInDom(testParams);

        $content.trigger("create");

        var $saveButton = $editTestParametersPage.find("#edit-test-parameters-save-button");

        $saveButton.click(function() {
            var category = $("#new-test-category-select").val();

        });

    });
}



function initPageLogic(found) {

    initTestsPageLogic(found);

    initEditTestsPageLogic(found);

    initTestingPageLogic(found);

    initNewTestPageLogic(found);

    initEditTestParametersPageLogic(found);

}