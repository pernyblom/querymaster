
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
    return new Test();
};
