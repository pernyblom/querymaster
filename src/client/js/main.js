

var testTemplates = {
    "simpleMathDualOperation": new SimpleMathDualOperationTemplate()
};

var testsData = {
    testCollections: [
        {
            name: "Math",
            tests: [
                {
                    name: "Simple Addition",
                    template: "simpleMathDualOperation",
                    templateParameters: {
                        questionCount: 5,
                        firstDomain: [1, 2, 3, [8, 12]],
                        secondDomain: [[0, 12], [20, 30]],
                        operations: ['addition']
                    }
                }
            ]
        },
        {
            name: "Math 2",
            tests: [
                {
                    name: "Simple Multiplication"
                },
                {
                    name: "Simple Addition",
                    template: "simpleMathDualOperation",
                    templateParameters: {
                        questionCount: 5,
                        firstDomain: [1, 2, 3, [8, 12]],
                        secondDomain: [[0, 12], [20, 30]],
                        operations: ['addition']
                    }
                }
            ]
        }
    ]
};

var currentCollection = null;
var currentTest = null;

$(document).ready(function() {


    var $testsCollectionsPage = $("#tests-collections-page");
    $testsCollectionsPage.on('pageshow', function(evt, data) {

        var htmlArr = [];

        var collections = testsData.testCollections;
        for (var i=0; i<collections.length; i++) {
            var collection = collections[i];
            htmlArr.push('<li><a href="#tests-page" data-test-collection-index="' + i + '"  >' + collection.name + '</a></li>')
        }

        var $testCollectionList = $("#test-collection-list");
        $testCollectionList.empty().append($(htmlArr.join(""))).listview("refresh");

        $testCollectionList.find("a").on('click', function() {
            var collectionIndex = $(this).data('test-collection-index');
            currentCollection = collections[collectionIndex];
        });

    });


    var $testsPage = $("#tests-page");
    $testsPage.on('pageshow', function(evt, data) {

        if (!currentCollection) {
            console.log("No collection is found...");
            return;
        }
        var htmlArr = [];

        var tests = currentCollection.tests;
        for (var i=0; i<tests.length; i++) {
            var test = tests[i];
            htmlArr.push('<li><a href="#testing-page" data-test-index="' + i + '" >' + test.name + '</a></li>')
        }

        var $testList = $("#test-list");
        $testList.empty().append($(htmlArr.join(""))).listview("refresh");

        $testList.find("a").on('click', function() {
            var testIndex = $(this).data('test-index');
            currentTest = currentCollection[testIndex];
        });

    });

});
