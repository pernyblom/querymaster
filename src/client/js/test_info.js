
function findTestInfo(categoryIndex, testIndex) {
    var result = null;
    var category = testsData.testCategories[categoryIndex];
    if (category) {
        result = category.testInfos[testIndex];
    }
    return result;
}

function TestInfoCategory() {
    this.name = "";
    this.tests = [];
    this._constructorName = "TestInfoCategory";
}

function TestInfo() {
    this.name = "";
    this.template = ""; // Constructor name
    this.parameterValues = {};
    this._constructorName = "TestInfo";
}