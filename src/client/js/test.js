
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
    this.initializeInDom($aParent);
};



function FixedLengthTest() {
    Test.call(this);
    this.questions = [];
    this.showTestInfo = true;
    this.testInfoHtml = "Info about test goes here...";
    this.questionIndex = -1;
    this.showingFeedback = false;
    this.answerInfo = null;
    this.correctFraction = 0;
    this.totalFraction = 0;
}
FixedLengthTest.prototype = new Test();


FixedLengthTest.prototype.getHtml = function(arr) {
    if (this.showingFeedback) {
        arr.push(
            '<div data-role="content">',
            this.answerInfo.badFeedbackContent,
            this.answerInfo.goodFeedbackContent,
            this.answerInfo.warningFeedbackContent,
            '<a href="#" id="feedback-ok-button" data-role="button">OK</a>',
            '</div>'
        );
    } else if (this.questionIndex == -1) {
        arr.push(
            '<div data-role="content">',
            this.testInfoHtml,
            '<a href="#" id="test-start-button" data-role="button">Start!</a>',
            '</div>'
        );
    } else if (this.questionIndex < this.questions.length) {
        var q = this.questions[this.questionIndex];
        q.getHtml(arr);
    } else {
        arr.push(
            '<div data-role="content">',
            'Percent correct: ' + Math.round((this.correctFraction / this.totalFraction) * 100),
            '</div>'
        );
    }
};

FixedLengthTest.prototype.initializeInDom = function($aParent) {
    $aParent.trigger("create");
    var test = this;
    if (this.showingFeedback) {
        $aParent.find("#feedback-ok-button").click(function() {
            test.questionIndex++;
            test.showingFeedback = false;
            test.refreshContent($aParent);
        });
    } else if (this.questionIndex == -1) {
        $aParent.find("#test-start-button").click(function() {
            console.log("Starting test...");
            test.questionIndex = 0;
            test.refreshContent($aParent);
        });
    } else if (this.questionIndex < this.questions.length) {
        var q = this.questions[this.questionIndex];
        q.initializeInDom($aParent);
        q.answerCallback = function(answerInfo) {
            test.showingFeedback = true;
            test.answerInfo = answerInfo;
            test.correctFraction += answerInfo.correctFraction;
            test.totalFraction += 1;
            test.refreshContent($aParent);
        };
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



