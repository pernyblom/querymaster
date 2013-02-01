
function Question() {
}
Question.prototype.evaluateAnswer = function() {
}
Question.prototype.getHtml = function(arr) {
}
Question.prototype.initializeInDom = function($aParent) {
}


function SingleTextAnswerQuestion() {
    Question.call(this);
    this.correctAnswers = [];
}
SingleTextAnswerQuestion.prototype = new Question();


