function SimpleMathDualOperationTemplate(name) {
    TestTemplate.call(this, name);
}
SimpleMathDualOperationTemplate.prototype = new TestTemplate();




SimpleMathDualOperationTemplate.prototype.addQuestions = function(test, templateParams) {
    test.questionsPerScreen = templateParams.questionsPerScreen || 1;

    var questions = [];

    var firstFunc = this.getOrCreateValueFunctionIfNecessary("firstValueFunction", templateParams);
    var secondFunc = this.getOrCreateValueFunctionIfNecessary("secondValueFunction", templateParams);

    for (var i=0; i<templateParams.questionCount; i++) {
        var q = new SingleTextAnswerQuestion();

        var operation = sampleData(templateParams.operations, Math);

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

SimpleMathDualOperationTemplate.prototype.getTest = function(parameterValues) {
    var result = new FixedLengthTest(this, parameterValues);
    return result;
};


