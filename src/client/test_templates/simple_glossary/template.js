function SimpleGlossaryTemplate(name) {
    TestTemplate.call(this, name);
}
SimpleGlossaryTemplate.prototype = new TestTemplate();


SimpleGlossaryTemplate.prototype.addQuestions = function(test, parameterValues) {
    test.questionsPerScreen = parameterValues.questionsPerScreen || 1;
    var questions = [];

    var pairs = parameterValues.pairs;

    var questionPairs = [];

    var count = Math.min(parameterValues.questionCount, pairs.length);

    var indexArr = createFilledNumericIncArray(pairs.length, 0, 1);

    arrayShuffle(indexArr, Math);

    for (var i=0; i<count; i++) {
        var q = new SingleTextAnswerQuestion();

        var pair = pairs[indexArr[i]];

        var correct = pair[1];
        q.inputType = "text";
        q.correctAnswers.push("" + correct);
        q.questionTexts = ["Translate '" + pair[0] + "' to " + parameterValues.languages[1]];
        questions.push(q);
    }
    test.questions = questions;
};

SimpleGlossaryTemplate.prototype.getTest = function(parameterValues) {
    var result = new FixedLengthTest(this, parameterValues);

    return result;
};

