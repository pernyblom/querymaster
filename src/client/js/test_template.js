
function TestTemplate() {

}
TestTemplate.prototype.getTest = function(templateParams) {
    return new Test();
};


function SimpleMathDualOperationTemplate() {
    TestTemplate.call(this);
}
SimpleMathDualOperationTemplate.prototype = new TestTemplate();



SimpleMathDualOperationTemplate.prototype.getTest = function(templateParams) {
    var result = new FixedLengthTest();
    var questions = [];
    for (var i=0; i<templateParams.questionCount; i++) {
        var q = new SingleTextAnswerQuestion();

        var operation = sampleData(templateParams.operations, Math);

        var first = templateParams.firstValueFunction(result, operation);
        var second = templateParams.secondValueFunction(result, operation, first);

        var correct = "";
        switch (operation) {
            case 'addition':
                correct = first + second;
                break;
            case 'multiplication':
                correct = first * second;
                break;
        }
        q.correctAnswers.push("" + correct);
        questions.push(q);
    }
    return result;
};

