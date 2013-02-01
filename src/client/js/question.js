
function Question() {
}
Question.prototype.evaluateAnswer = function() {
}
Question.prototype.getHtml = function(arr) {
    arr.push('Question content goes here...');
}
Question.prototype.initializeInDom = function($aParent) {
}


function SingleTextAnswerQuestion() {
    Question.call(this);
    this.questionHtml = "";
    this.answerCallback = null;
    this.correctAnswers = [];
    this.inputType = "text"
}
SingleTextAnswerQuestion.prototype = new Question();

SingleTextAnswerQuestion.prototype.getHtml = function(arr) {
    arr.push(this.questionHtml);
    arr.push('<input type="' + this.inputType + '" id="question-input" />');
    arr.push('<button id="answer-button" data-role="button" >Answer</button>')
}

SingleTextAnswerQuestion.prototype.initializeInDom = function($aParent) {
    var $answerButton = $aParent.find("#answer-button");
    var $questionInput = $aParent.find("#question-input");
    var that = this;
    $answerButton.trigger("create").click(function() {
        console.log("Answer clicked...");
        var answerValue = $questionInput.val();
        var index = that.correctAnswers.indexOf(answerValue.trim());
        if (index >= 0) {
            console.log("Correct answer! " + answerValue);
        } else {
            console.log("Not correct answer: " + answerValue + " among: " + that.correctAnswers.join(""));
        }
        if (that.answerCallback) {
            var answerInfo = new AnswerInfo();
            var correct = index >= 0;
            answerInfo.correctFraction = correct ? 1 : 0;
            if (correct) {
                answerInfo.goodFeedbackContent = "Correct!";
            } else {
                answerInfo.badFeedbackContent = "The answer '" + answerValue + "' was not correct. ";
                if (that.correctAnswers.length == 1) {
                    answerInfo.badFeedbackContent += "The correct answer was: " + that.correctAnswers[0];
                } else if (that.correctAnswers.length > 1) {
                    answerInfo.badFeedbackContent += "Possible correct answers: " + that.correctAnswers.join(", ");
                }
            }
            that.answerCallback(answerInfo);
        }
    });
}


