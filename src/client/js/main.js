
var idCounter = 1;

var testTemplates = {
    "simpleMathDualOperation": new SimpleMathDualOperationTemplate(),
    "simpleGlossary": new SimpleGlossaryTemplate()
};

var testsData = {
    testCollections: [
        {
            name: "Language",
            tests: [
                {
                    name: "Glossary I",
                    template: "simpleGlossary",
                    parameterValues: {
                        pairs: [["horse", "häst"], ["cat", "katt"], ["dog", "hund"], ["bird", "fågel"], ["mouse", "mus"]],
                        languages: ["English", "Swedish"],
                        reverse: false,
                        questionsPerScreen: 1,
                        questionCount: 4
                    }
                }
            ]
        },
        {
            name: "Math",
            tests: [
                {
                    name: "Multiplication",
                    template: "simpleMathDualOperation",
                    parameterValues: {
                        questionCount: 5,
                        questionsPerScreen: 2,
                        firstValueFunction: function(test, operation) {
                            return Math.round(Math.random() * 9 + 1);
                        },
                        secondValueFunction: function(test, operation, firstValue) {
                            return Math.round(Math.random() * 9 + 1);
                        },
                        operations: [
                            {data: 'multiplication', likelihood: 1}
                        ]
                    }
                },
                {
                    name: "Addition and Multiplication",
                    template: "simpleMathDualOperation",
                    parameterValues: {
                        questionCount: 5,
                        firstValueFunction: function(test, operation) {
                            switch (operation) {
                                case 'addition':
                                    return Math.round(Math.random() * 99 + 1);
                                case 'multiplication':
                                    return Math.round(Math.random() * 9 + 1);
                            }
                            return 1;
                        },
                        secondValueFunction: function(test, operation, firstValue) {
                            switch (operation) {
                                case 'addition':
                                    return Math.round(Math.random() * 99 + 1);
                                case 'multiplication':
                                    return Math.round(Math.random() * 9 + 1);
                            }
                            return 1;
                        },
                        operations: [
                            {data: 'multiplication', likelihood: 1},
                            {data: 'addition', likelihood: 1}
                        ]
                    }
                }
            ]
        }
    ]
};

var currentTestInfo = null;

$(document).ready(function() {


    var $testsCollectionsPage = $("#tests-collections-page");
    $testsCollectionsPage.on('pagebeforeshow', function(evt, data) {

        var htmlArr = [];

        currentTestInfo = null;

        var collections = testsData.testCollections;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<div data-role="collapsible" >');
            htmlArr.push('<h3>' + collection.name + '</h3>');
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



    var $testingPage = $("#testing-page");

    function initTest() {
        console.log("Running test " + currentTestInfo);
        if (!currentTestInfo) {
            console.log("Test not available yet...");
            setTimeout(initTest, 500);
            return;
        }

        var testTemplate = testTemplates[currentTestInfo.template];
        if (!testTemplate) {
            console.log("Could not find a test template with name " + currentTestInfo.template + " in:");
            console.log(testTemplates);
            return;
        }

        var test = testTemplate.getTest(currentTestInfo.parameterValues);
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


});
