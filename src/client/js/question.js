
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
    this.questionTexts = [];
    this.correctAnswers = [];
    this.inputType = "text";
    this.questionTextsTag = "p";
    this.$questionInput = null;
    this.questionInputId = "";
}
SingleTextAnswerQuestion.prototype = new Question();

SingleTextAnswerQuestion.prototype.getHtml = function(arr) {
    for (var i=0; i<this.questionTexts.length; i++) {
        var t = this.questionTexts[i];
        arr.push('<' + this.questionTextsTag + ' >', _.escape(t), '</' + this.questionTextsTag + '>');
    }
    this.questionInputId = 'question-input-' + idCounter++;
    arr.push('<input type="' + this.inputType + '" id="' + this.questionInputId + '" />');
}

SingleTextAnswerQuestion.prototype.evaluateAnswer = function($aParent) {
    var answerValue = this.$questionInput.val();
    var that = this;
    var index = that.correctAnswers.indexOf(answerValue.trim());
    if (index >= 0) {
//        console.log("Correct answer! " + answerValue);
    } else {
//        console.log("Not correct answer: " + answerValue + " among: " + that.correctAnswers.join(""));
    }
    var answerInfo = new AnswerInfo();
    var correct = index >= 0;
    answerInfo.correctFraction = correct ? 1 : 0;

    var feedback = "Question: " + this.questionTexts.join(" ") + ".";
    if (correct) {
        answerInfo.goodFeedbackContent = feedback + " You answered '" + answerValue + "' and that was correct!";
    } else {
        answerInfo.badFeedbackContent = feedback + " The answer '" + answerValue + "' was not correct. ";
        if (that.correctAnswers.length == 1) {
            answerInfo.badFeedbackContent += "The correct answer was: " + that.correctAnswers[0];
        } else if (that.correctAnswers.length > 1) {
            answerInfo.badFeedbackContent += "Possible correct answers: " + that.correctAnswers.join(", ");
        }
    }
    return answerInfo;
};

SingleTextAnswerQuestion.prototype.initializeInDom = function($aParent) {
    this.$questionInput = $aParent.find("#" + this.questionInputId);
}


