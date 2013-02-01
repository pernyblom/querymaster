
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
        q.questionHtml = "<h2>" + first + " " + opStr + " " + second + "</h2>";
        questions.push(q);
    }
    result.questions = questions;
    return result;
};

