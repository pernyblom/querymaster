

function TestTemplate() {
    this.parameters = [];
}
TestTemplate.prototype.getTest = function(parameterValues) {
    return new Test(this, parameterValues);
};
TestTemplate.prototype.addQuestions = function(test, templateParams) {
};


TestTemplate.prototype.getParameters = function() {
    return this.parameters;
};


function SimpleMathDualOperationTemplate() {
    TestTemplate.call(this);
}
SimpleMathDualOperationTemplate.prototype = new TestTemplate();


SimpleMathDualOperationTemplate.prototype.addQuestions = function(test, templateParams) {
    test.questionsPerScreen = templateParams.questionsPerScreen || 1;

    var questions = [];
    for (var i=0; i<templateParams.questionCount; i++) {
        var q = new SingleTextAnswerQuestion();

        var operation = sampleData(templateParams.operations, Math);

        var first = templateParams.firstValueFunction(test, operation);
        var second = templateParams.secondValueFunction(test, operation, first);

        var correct = "";
        var opStr = "";
        switch (operation) {
            case 'addition':
                correct = first + second;
                opStr = "+";
                break;
            case 'multiplication':
                correct = first * second;
                opStr = "*";
                break;
        }
        q.inputType = "number";
        q.correctAnswers.push("" + correct);
        q.questionTexts = [first + " " + opStr + " " + second];
        questions.push(q);
    }
    test.questions = questions;
};

SimpleMathDualOperationTemplate.prototype.getTest = function(parameterValues) {
    var result = new FixedLengthTest(this, parameterValues);
    return result;
};


function SimpleGlossaryTemplate() {
    TestTemplate.call(this);
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




