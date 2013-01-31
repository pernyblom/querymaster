
function QuestionInfo() {
    this.name = "";
}

$(document).ready(function() {

    var arr = [
        '<li><a href="#">Hej</li>',
        '<li><a href="#">Per</li>'
    ];

    $("#test-list").append($(arr.join(""))).listview("refresh");
});
