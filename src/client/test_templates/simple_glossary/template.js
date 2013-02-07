function SimpleGlossaryTemplate() {
    TestTemplate.call(this, "Simple Glossary");
    this._constructorName = "SimpleGlossaryTemplate";
}
SimpleGlossaryTemplate.prototype = new TestTemplate();


SimpleGlossaryTemplate.prototype.addQuestions = function(test, testInfo) {
    var parameterValues = testInfo.parameterValues;
    test.questionsPerScreen = parameterValues.questionsPerScreen || 1;
    var questions = [];

    var pairs = parameterValues.pairs;

    var questionPairs = [];

    var count = Math.min(parameterValues.questionCount, pairs.length);

    var indexArr = _.range(0, pairs.length, 1); // createFilledNumericIncArray(pairs.length, 0, 1);

    indexArr = _.shuffle(indexArr);

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

SimpleGlossaryTemplate.prototype.getTest = function(testInfo) {
    var result = new FixedLengthTest(this, testInfo);

    return result;
};

