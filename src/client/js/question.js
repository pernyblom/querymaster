
function Question() {
}
Question.prototype.evaluateAnswer = function($aParent, test) {
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

SingleTextAnswerQuestion.prototype.evaluateAnswer = function($aParent, test) {
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

    var questionStr = localizePropertyWithFallbackCap('question', "Question", test.template.localizationData, localizationData);

    var feedback = questionStr + ": " + this.questionTexts.join(" ") + ".";
    if (correct) {
        var youAnsweredStr = localizePropertyWithFallbackCap('you-answered', "You answered", test.template.localizationData, localizationData);
        var andThatWasCorrectStr = localizePropertyWithFallbackCap('and-that-was-correct', "and that was correct", test.template.localizationData, localizationData);
        answerInfo.goodFeedbackContent = feedback + " " +
            youAnsweredStr +
            " '" + answerValue + "' " +
            andThatWasCorrectStr +
            "!";
    } else {
        var theAnswerStr = localizePropertyWithFallbackCap('the-answer', "the answer", test.template.localizationData, localizationData);
        var wasNotCorrectStr = localizePropertyWithFallback('was-not-correct', "was not correct", test.template.localizationData, localizationData);
        answerInfo.badFeedbackContent = feedback + " " +
            theAnswerStr +
            " '" + answerValue + "' " +
            wasNotCorrectStr +
            ". ";
        if (that.correctAnswers.length == 1) {
            var theCorrectStr = localizePropertyWithFallbackCap('the-correct-answer-was', "The correct answer was", test.template.localizationData, localizationData);

            answerInfo.badFeedbackContent +=
                theCorrectStr +
                ": " + that.correctAnswers[0];
        } else if (that.correctAnswers.length > 1) {
            var possibleCorrectStr = localizePropertyWithFallbackCap('possible-correct-answers', "Possible correct answers", test.template.localizationData, localizationData);
            answerInfo.badFeedbackContent +=
                possibleCorrectStr +
                    ": " + that.correctAnswers.join(", ");
        }
    }
    return answerInfo;
};

SingleTextAnswerQuestion.prototype.initializeInDom = function($aParent) {
    this.$questionInput = $aParent.find("#" + this.questionInputId);
}


