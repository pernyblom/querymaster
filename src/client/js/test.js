
function Test() {
    this.doneCallback = null;
}
Test.prototype.getHtml = function(arr) {
};
Test.prototype.initializeInDom = function($aParent) {
};
Test.prototype.hasMoreQuestions = function() {
    return false;
};
Test.prototype.getCorrectFraction = function() {
    return 0;
};
Test.prototype.getTotalFraction = function() {
    return 0;
};
Test.prototype.getNextQuestion = function() {
    return null;
};
Test.prototype.evaluateAnswer = function(question) {
    var answerInfo = question.evaluateAnswer();
};
Test.prototype.runTest = function($testContent, callback) {
    this.doneCallback = callback;
    this.refreshContent($testContent);
}
Test.prototype.refreshContent = function($aParent) {
    $aParent.empty();
    var htmlArr = [];
    this.getHtml(htmlArr);
    $aParent.append(htmlArr.join(""));
};



function FixedLengthTest(questions) {
    Test.call(this);
    this.questions = questions;
    this.showTestInfo = true;
    this.testInfoHtml = "Info about test goes here...";
    this.questionIndex = -1;
    this.correctFraction = 0;
    this.totalFraction = 0;
}
FixedLengthTest.prototype = new Test();


FixedLengthTest.prototype.getHtml = function(arr) {
    if (this.questionIndex == -1) {
        arr.push(
            '<div data-role="content">',
            this.testInfoHtml,
            '</div>',
            '<button id="test-start-button" data-role="button">Start!</button>'
        );
    } else if (this.questionIndex < this.questions.length) {
        var q = this.questions[this.questionIndex];
        q.getHtml(arr);
    } else {
        arr.push(
            '<div data-role="content">',
            'Test results goes here...',
            '</div>'
        );
    }
};

FixedLengthTest.prototype.initializeInDom = function($aParent) {
    $aParent.trigger("create");
    var test = this;
    if (this.questionIndex == -1) {
        $aParent.find("#test-start-button").click(function() {
            console.log("Starting test...");
            test.questionIndex = 0;
            test.refreshContent();
        });
    } else if (this.questionIndex < this.questions.length) {
        var q = this.questions[this.questionIndex];
        q.initializeInDom($aParent);
    } else {
    }
};


FixedLengthTest.prototype.hasMoreQuestions = function() {
    return this.questionIndex < this.questions.length;
};

FixedLengthTest.prototype.getCorrectFraction = function() {
    return this.correctFraction;
};

FixedLengthTest.prototype.getTotalFraction = function() {
    return this.totalFraction;
};

FixedLengthTest.prototype.getNextQuestion = function() {
    return this.questions[this.questionIndex];
};



