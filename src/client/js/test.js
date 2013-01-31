
function Test() {
}
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


function FixedLengthTest(questions) {
    Test.call(this);
    this.questions = questions;
    this.questionIndex = 0;
    this.correctFraction = 0;
    this.totalFraction = 0;
}
FixedLengthTest.prototype = new Test();

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



