
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

    result.questionsPerFeedback = templateParams.questionsPerFeedback || 1;
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
        q.questionTexts = [first + " " + opStr + " " + second];
        questions.push(q);
    }
    result.questions = questions;
    return result;
};


function SimpleGlossaryTemplate() {
    TestTemplate.call(this);
}
SimpleGlossaryTemplate.prototype = new TestTemplate();



SimpleGlossaryTemplate.prototype.getTest = function(templateParams) {
    var result = new FixedLengthTest();

    result.questionsPerFeedback = templateParams.questionsPerFeedback || 1;
    var questions = [];

    var pairs = templateParams.pairs;

    var questionPairs = [];

    var count = Math.min(templateParams.questionCount, pairs.length);

    var indexArr = createFilledNumericIncArray(pairs.length, 0, 1);

    arrayShuffle(indexArr, Math);

    for (var i=0; i<count; i++) {
        var q = new SingleTextAnswerQuestion();

        var pair = pairs[indexArr[i]];

        var correct = pair[1];
        q.inputType = "text";
        q.correctAnswers.push("" + correct);
        q.questionTexts = ["Translate '" + pair[0] + "' to " + templateParams.languages[1]];
        questions.push(q);
    }
    result.questions = questions;
    return result;
};


