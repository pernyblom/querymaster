
var TestState = {
    INFO: 0,
    QUESTIONS: 1,
    FEEDBACK: 2,
    RESULT: 3
};

function Test(template, parameterValues) {
    this.doneCallback = null;
    this.template = template;
    this.parameters = [];
    this.parameterValues = parameterValues;
    this.testInfoHtml = "Info about test goes here...";
    this.correctFraction = 0;
    this.totalFraction = 0;
    this.state = TestState.INFO;

}
Test.prototype.getParameters = function() {
    return this.parameters;
};

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

Test.prototype.getFeedbackHtml = function(arr) {
    arr.push(
        '<div data-role="content">'
    );
    for (var i=0; i<this.answerInfos.length; i++) {
        var answerInfo = this.answerInfos[i];
        arr.push(
            '<p>',
            answerInfo.badFeedbackContent,
            answerInfo.goodFeedbackContent,
            answerInfo.warningFeedbackContent,
            '</p>'
        );
    }
    arr.push(
        '<a href="#" id="feedback-ok-button" data-role="button">OK</a>',
        '</div>'
    );
};


Test.prototype.getParametersHtml = function(params, arr) {
    for (var i=0; i<params.length; i++) {
        var param = params[i];
        if (!this.parameterValues[param.propertyName]) {
            // Parameter does not exist yet
            param.getHtml(arr);
        }
    }
};

Test.prototype.getTestInfoHtml = function(arr) {
    var parametersHtmlArr = [];

    var tParams = this.template.getParameters();
    var params = this.getParameters();

    this.getParametersHtml(params, parametersHtmlArr);
    this.getParametersHtml(tParams, parametersHtmlArr);

    var parametersHtml = parametersHtmlArr.join("");
    arr.push(
        '<div data-role="content">',
        this.testInfoHtml,
        parametersHtml,
        '<a href="#" id="test-start-button" data-role="button">Start!</a>',
        '</div>'
    );
};

Test.prototype.getTestResultHtml = function(arr) {
    arr.push(
        '<div data-role="content">',
        'Percent correct: ' + Math.round((this.correctFraction / this.totalFraction) * 100),
        '</div>'
    );
};

Test.prototype.getQuestionsHtml = function(arr) {
};


Test.prototype.getHtml = function(arr) {
    switch (this.state) {
        case TestState.INFO:
            this.getTestInfoHtml(arr);
            break;
        case TestState.QUESTIONS:
            this.getQuestionsHtml(arr)
            break;
        case TestState.FEEDBACK:
            this.getFeedbackHtml(arr);
            break;
        case TestState.RESULT:
            this.getTestResultHtml(arr);
            break;
    }
};

Test.prototype.getParameterValues = function(params, $aParent) {
    for (var i=0; i<params.length; i++) {
        var param = params[i];
        if (!this.parameterValues[param.propertyName]) {
            var value = param.getValue($aParent);
            this.parameterValues[param.propertyName] = value;
//            console.log("Setting parameter " + param.propertyName + " to " + value);
        }
    }
};



Test.prototype.startTest = function($aParent) {
    // Fill parameter values from test
    var tParams = this.template.getParameters();
    var tdParams = this.template.getDataParameters();
    var params = this.getParameters();

    this.getParameterValues(tParams, $aParent);
    this.getParameterValues(tdParams, $aParent);
    this.getParameterValues(params, $aParent);

    this.template.addQuestions(this, this.parameterValues);

    this.state = TestState.QUESTIONS;

    this.refreshContent($aParent);
};

Test.prototype.initializeTestInfoInDom = function($aParent) {
    var that = this;
    $aParent.find("#test-start-button").click(function() {
        that.startTest($aParent);
    });
};

Test.prototype.initializeQuestionsInDom = function($aParent) {
};

Test.prototype.initializeFeedbackInDom = function($aParent) {
};

Test.prototype.initializeInDom = function($aParent) {
    $aParent.trigger("create");

    var that = this;

    switch (this.state) {
        case TestState.INFO:
            that.initializeTestInfoInDom($aParent);
            break;
        case TestState.QUESTIONS:
            that.initializeQuestionsInDom($aParent);
            break;
        case TestState.FEEDBACK:
            that.initializeFeedbackInDom($aParent);
            break;
        case TestState.RESULT:
            break;
    }

};

function FixedLengthTest(template, parameterValues) {
    Test.call(this, template, parameterValues);
    this.questions = [];
    this.questionIndex = 0;
    this.questionsPerScreen = 1;
    this.answerInfos = [];
    this.parameters = [
        new TestParameter("Question Count", "questionCount", TestParameterType.RANGED_INTEGER, 10, {range: [1, 100]}),
        new TestParameter("Questions Per Screen", "questionsPerScreen", TestParameterType.RANGED_INTEGER, 5, {range: [1, 10]})
    ];

}
FixedLengthTest.prototype = new Test();



FixedLengthTest.prototype.getQuestionsHtml = function(arr) {
    for (var i=this.questionIndex; i<Math.min(this.questions.length, this.questionIndex + this.questionsPerScreen); i++) {
        var q = this.questions[i];
        q.getHtml(arr);
    }
    arr.push('<button id="answer-button" data-role="button" >Answer</button>');
};


FixedLengthTest.prototype.initializeQuestionsInDom = function($aParent) {
    var that = this;
    var questionCount = 0;
    for (var i=this.questionIndex; i<Math.min(this.questions.length, this.questionIndex + this.questionsPerScreen); i++) {
        var q = this.questions[i];
        q.initializeInDom($aParent);
        questionCount++;
    }

    var $answerButton = $aParent.find("#answer-button");
    $answerButton.trigger("create").click(function() {
        that.answerInfos = [];
        for (var i=0; i<questionCount; i++) {
            var q = that.questions[i + that.questionIndex];
            var answerInfo = q.evaluateAnswer();
            that.answerInfos.push(answerInfo);
            that.correctFraction += answerInfo.correctFraction;
            that.totalFraction += 1;
        }
        that.state = TestState.FEEDBACK;
        that.refreshContent($aParent);
    });
};


FixedLengthTest.prototype.initializeFeedbackInDom = function($aParent) {
    var that = this;
    $aParent.find("#feedback-ok-button").click(function() {
        that.questionIndex += that.questionsPerScreen;
        if (that.hasMoreQuestions()) {
            that.state = TestState.QUESTIONS;
        } else {
            that.state = TestState.RESULT;
        }
        that.refreshContent($aParent);
    });
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



