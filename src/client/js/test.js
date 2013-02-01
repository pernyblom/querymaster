
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
    this.questionsPerFeedback = 1;
    this.showingFeedback = false;
    this.answerInfos = [];
    this.correctFraction = 0;
    this.totalFraction = 0;
}
FixedLengthTest.prototype = new Test();


FixedLengthTest.prototype.getHtml = function(arr) {
    if (this.showingFeedback) {
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
    } else if (this.questionIndex == -1) {
        arr.push(
            '<div data-role="content">',
            this.testInfoHtml,
            '<a href="#" id="test-start-button" data-role="button">Start!</a>',
            '</div>'
        );
    } else if (this.questionIndex < this.questions.length) {
        for (var i=this.questionIndex; i<Math.min(this.questions.length, this.questionIndex + this.questionsPerFeedback); i++) {
            var q = this.questions[i];
            q.getHtml(arr);
        }
        arr.push('<button id="answer-button" data-role="button" >Answer</button>');
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
    var that = this;
    if (this.showingFeedback) {
        $aParent.find("#feedback-ok-button").click(function() {
            that.questionIndex += that.questionsPerFeedback;
            that.showingFeedback = false;
            that.refreshContent($aParent);
        });
    } else if (this.questionIndex == -1) {
        $aParent.find("#test-start-button").click(function() {
            console.log("Starting test...");
            that.questionIndex = 0;
            that.refreshContent($aParent);
        });
    } else if (this.questionIndex < this.questions.length) {
        var questionCount = 0;
        for (var i=this.questionIndex; i<Math.min(this.questions.length, this.questionIndex + this.questionsPerFeedback); i++) {
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
            that.showingFeedback = true;
            that.refreshContent($aParent);
        });


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



