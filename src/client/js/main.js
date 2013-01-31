

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
        }
    ]
};

var currentCollection = null;
var currentTest = null;

$(document).ready(function() {
    var $testsPage = $("#tests-page");
    $testsPage.on('pageshow', function(evt, data) {
        console.log("Showing tests page");

        var arr = [
            '<li><a href="#">Hej</a></li>',
            '<li><a href="#">Per</a></li>'
        ];

        $("#test-list").empty().append($(arr.join(""))).listview("refresh");
    });

});
