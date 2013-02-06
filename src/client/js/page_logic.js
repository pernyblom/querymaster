
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

    var $editTestButton = $editTestsPage.find(".edit-test-button");
    var $duplicateTestButton = $editTestsPage.find(".duplicate-test-button");
    var $moveTestButton = $editTestsPage.find(".move-test-button");
    var $deleteTestButton = $editTestsPage.find(".delete-test-button");

    var $addTestButton = $editTestsPage.find(".add-test-button");

    var selectedTests = {};
    var selectedTest = null;

    $editTestsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        var categories = testsData.testCategories;

        if (categories.length > 0) {
            htmlArr.push(
                '<h4>Test categories:</h4>'
            );
            $addTestButton.removeClass('ui-disabled');
        } else {
            htmlArr.push(
                '<h4>No categories</h4>'
            );
            $addTestButton.addClass('ui-disabled');
        }

        for (var i=0; i<categories.length; i++) {
            var category = categories[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + category.name,
                '</h3>'
            );
            htmlArr.push(
                '<a data-role="button" class="rename-category-button" data-icon="gear" ' +
                    'data-category-index="' + i + '" ' +
                    'id="rename-category-button-' + i + '" ' +
                    'data-inline="true" ' +
                    'data-mini="true" ' +
                    'href="#rename-category-page" >Rename "' + category.name + '"</a>',
                '<a data-role="button" class="delete-category-button" data-icon="gear" ' +
                    'data-category-index="' + i + '" ' +
                    'id="delete-category-button-' + i + '" ' +
                    'data-inline="true" ' +
                    'data-mini="true" ' +
                    'href="#delete-category-page" >Delete "' + category.name + '"</a>'
            );
            if (category.testInfos.length > 0) {
                htmlArr.push(
                    '<h4>Tests in category "' + category.name + '":</h4>'
                );
            } else {
                htmlArr.push(
                    '<h4>No tests in category "' + category.name + '"</h4>'
                );
            }
            for (var j=0; j<category.testInfos.length; j++) {
                var test = category.testInfos[j];
                var testId = "test_cb_" + i + "_" + j;
                htmlArr.push(
                    '<input ' +
                        'type="checkbox" ' +
                        'name="' + testId + '" ' +
                        'id="' + testId + '" ' +
                        'class="edit-tests-page-test-cb" ' +
                        'data-category-index="' + i + '" ' +
                        'data-test-index="' + j + '" ' +
                        '/>',
                    '<label for="' + testId + '">', test.name, '</label>'
                )
            }
            htmlArr.push('</div>');
        }

        var $editTestsDiv = $("#edit-tests-div");
        $editTestsDiv.empty().append($(htmlArr.join("")));
        $editTestsDiv.trigger("create");

        var $renameAndDeleteButtons = $editTestsDiv.find(".rename-category-button, .delete-category-button");
        $renameAndDeleteButtons.on('click', function() {
            var $button = $(this);
            var catIndex = $button.data('category-index');
            activeCategory = testsData.testCategories[catIndex];
        });

        var $testCheckboxes = $editTestsDiv.find(".edit-tests-page-test-cb");
        $testCheckboxes.on('change', function() {
            var $cb = $(this);
            if (this.checked) {
                selectedTests[this.id] = {categoryIndex: $cb.data('category-index'), testIndex: $cb.data('test-index')};
            } else {
                delete selectedTests[this.id];
            }
            var count = 0;
            selectedTest = null;
            for (var prop in selectedTests) {
                count++;
                selectedTest = selectedTests[prop];
            }
            if (count == 1) {
                $editTestButton.removeClass('ui-disabled');
                $duplicateTestButton.removeClass('ui-disabled');
                $moveTestButton.removeClass('ui-disabled');
            } else {
                $editTestButton.addClass('ui-disabled');
                $duplicateTestButton.addClass('ui-disabled');
                $moveTestButton.addClass('ui-disabled');
            }
            if (count > 0) {
                $deleteTestButton.removeClass('ui-disabled');
            } else {
                $deleteTestButton.addClass('ui-disabled');
            }
        });

        // Reset these each time the page loads
        selectedTests = {};
        selectedTest = null;
    });

    $editTestButton.on('click', function() {
        if (selectedTest) {
            testInfoToEdit = findTestInfo(selectedTest.categoryIndex, selectedTest.testIndex);
            activeCategory = testsData.testCategories[selectedTest.categoryIndex];
            saveTestBackSteps = 1;
        }
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

    var $newTestPage = $("#add-test-page");

    $newTestPage.on('pagebeforeshow', function(evt, data) {


        var $newTestContent = $("#add-test-content");
        $newTestContent.empty();


        var htmlArr = [];


        // Template select
        htmlArr.push(
            '<div data-role="fieldcontain">',
            '<label for="add-test-template-select" >Template</label>',
            '<select id="add-test-template-select">'
        );

        for (var i=0; i<testTemplates.length; i++) {
            var t = testTemplates[i];
            htmlArr.push('<option value="' + t._constructorName + '">', t.displayName, '</option>')
        }

        htmlArr.push('</select>', '</div>');


        $newTestContent.append($(htmlArr.join("")));

        $newTestContent.trigger("create");

    });


    var $newTestNextButton = $newTestPage.find("#add-test-next-button");

    $newTestNextButton.click(function() {
        var template = $newTestPage.find("#add-test-template-select").val();

        testInfoToEdit = new TestInfo();
        activeCategory = null;
        saveTestBackSteps = 2;
        testInfoToEdit.template = template;

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

        // Category select only when creating new test
        if (!activeCategory) {

            htmlArr.push(
                '<div data-role="fieldcontain">',
                '<label for="add-test-category-select" >Category</label>',
                '<select id="add-test-category-select">'
            );

            var collections = testsData.testCategories;
            for (var i=0; i<collections.length; i++) {
                var collection = collections[i];
                htmlArr.push('<option value="' + collection.name + '">', collection.name, '</option>')
            }

            htmlArr.push('</select>', '</div>');
        }

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


    });

    var $saveButton = $editTestParametersPage.find("#edit-test-parameters-save-button");
    $saveButton.click(function() {
        var categoryName = "";
        if (activeCategory) {
            categoryName = activeCategory.name;
        } else {
            categoryName = $("#add-test-category-select").val();
        }
        console.log("Saving in category " + categoryName);

        window.history.go(-saveTestBackSteps);
    });

}

function verifyAndUpdateCategoryNameInput($categoryNameInput, $confirmButton, $errorLabel, options) {
    if (!options) {
        options = {};
    }

    var errors = []
    var newName = $categoryNameInput.val().trim();
    var nameOk = categoryNameOk(newName, errors, options.okNames);
    if (nameOk) {
        $confirmButton.removeClass("ui-disabled");
    } else {
        $confirmButton.addClass("ui-disabled");
    }
    var errorString = errors.join(", ");
    if (!errorString) {
        var noErrorMessage = options.noErrorMessage;
        if (!noErrorMessage) {
            noErrorMessage = 'Name OK!';
        }
        errorString = noErrorMessage;
    }
    $errorLabel[0].innerHTML = errorString;

}


function initAddCategoryPageLogic(serverFound) {

    var $addCategoryPage = $("#add-category-page");

    var $addButton = $addCategoryPage.find("#add-category-confirm-button");
    var $categoryNameInput = $addCategoryPage.find("#add-category-name-input");
    var $errorLabel = $addCategoryPage.find("#add-category-error-label");

    var verifyOptions = {noErrorMessage: "Press 'Add' to create a new category"};

    $addCategoryPage.on('pagebeforeshow', function(evt, data) {
        $categoryNameInput.val(getUniqueCategoryName());
        verifyAndUpdateCategoryNameInput($categoryNameInput, $addButton, $errorLabel, verifyOptions);
    });

    $categoryNameInput.on('keydown keypress keyup change', function() {
        verifyAndUpdateCategoryNameInput($categoryNameInput, $addButton, $errorLabel, verifyOptions);
    });

    $addButton.on('click', function() {
        var newName = $categoryNameInput.val().trim();
        if (categoryNameOk(newName, [])) {
            var newCat = new TestInfoCategory();
            newCat.name = newName;
            testsData.testCategories.push(newCat);
        }
    });
}


function initRenameCategoryPageLogic(serverFound) {

    var $renameCategoryPage = $("#rename-category-page");

    var $addButton = $renameCategoryPage.find("#rename-category-confirm-button");
    var $categoryNameInput = $renameCategoryPage.find("#rename-category-name-input");
    var $errorLabel = $renameCategoryPage.find("#rename-category-error-label");

    var okNames = {};
    var verifyOptions = {};
    $renameCategoryPage.on('pagebeforeshow', function(evt, data) {
        okNames[activeCategory.name] = true;
        verifyOptions = {okNames: okNames, noErrorMessage: "Press 'Rename' to change the name of category '" + activeCategory.name + "'"};
        $categoryNameInput.val(activeCategory.name);
        verifyAndUpdateCategoryNameInput($categoryNameInput, $addButton, $errorLabel, verifyOptions);
    });

    $categoryNameInput.on('keydown keypress keyup change', function() {
        verifyAndUpdateCategoryNameInput($categoryNameInput, $addButton, $errorLabel, verifyOptions);
    });

    $addButton.on('click', function() {
        var newName = $categoryNameInput.val().trim();
        if (categoryNameOk(newName, [], okNames)) {
            activeCategory.name = newName;
        }
    });
}


function initDeleteCategoryPageLogic(serverFound) {

    var $deleteCategoryPage = $("#delete-category-page");

    var $deleteButton = $deleteCategoryPage.find("#delete-category-confirm-button");
    var $content = $deleteCategoryPage.find("#delete-category-content");

    $deleteCategoryPage.on('pagebeforeshow', function(evt, data) {
        $content.empty();
        var htmlArr = [
            '<p>This will delete category "' + activeCategory.name + '"</p>'
        ];
        if (activeCategory.testInfos.length > 0) {
            var single = activeCategory.testInfos.length == 1;
            htmlArr.push('<p>All tests in that category will also be deleted. There ',
                single ? "is " : "are ",
                activeCategory.testInfos.length,
                single ? " test" : " tests",
                ' in there.',
                '</p>');
        } else {
            htmlArr.push('<p>The category is empty</p>');
        }
        htmlArr.push('<p>Are you sure about this?</p>');

        $content.append($(htmlArr.join("")));
    });

    $deleteButton.on('click', function() {
        var catIndex = getCategoryIndexWithName(activeCategory.name);
        if (catIndex >= 0) {
            testsData.testCategories.splice(catIndex, 1);
        }
    });
}



function initPageLogic(found) {

    initTestsPageLogic(found);

    initEditTestsPageLogic(found);

    initTestingPageLogic(found);

    initNewTestPageLogic(found);

    initEditTestParametersPageLogic(found);

    initAddCategoryPageLogic(found);
    initRenameCategoryPageLogic(found);
    initDeleteCategoryPageLogic(found);
}