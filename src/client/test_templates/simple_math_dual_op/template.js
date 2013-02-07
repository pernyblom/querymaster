function SimpleMathDualOperationTemplate() {
    TestTemplate.call(this, "Simple Math Dual Operation");
    this._constructorName = "SimpleMathDualOperationTemplate";
}
SimpleMathDualOperationTemplate.prototype = new TestTemplate();




SimpleMathDualOperationTemplate.prototype.addQuestions = function(test, testInfo) {
    var parameterValues = testInfo.parameterValues;
    test.questionsPerScreen = parameterValues.questionsPerScreen || 1;

    var questions = [];

    var firstFunc = this.getOrCreateValueFunctionIfNecessary("firstValueFunction", parameterValues);
    var secondFunc = this.getOrCreateValueFunctionIfNecessary("secondValueFunction", parameterValues);

    for (var i=0; i<parameterValues.questionCount; i++) {
        var q = new SingleTextAnswerQuestion();

        var operation = sampleData(parameterValues.operations, Math);

        var first = firstFunc(test, operation);
        var second = secondFunc(test, operation, first);

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

SimpleMathDualOperationTemplate.prototype.getTest = function(testInfo) {
    var result = new FixedLengthTest(this, testInfo);
    return result;
};


