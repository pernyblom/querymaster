
function findTestInfo(categoryIndex, testIndex) {
    var result = null;
    var category = testsData.testCategories[categoryIndex];
    if (category) {
        result = category.testInfos[testIndex];
    }
    return result;
}

function categoryNameOk(name, errors, okNames) {
    if (!name) {
        errors.push("Category must have a name");
    }
    if (okNames && okNames[name]) {
        return true;
    }
    if (categoryExists(name)) {
        errors.push('Another category named "' + name + '" alread exists');
    }
    return errors.length == 0;
}

function getCategoryIdMap() {
    var result = {};
    var categories = testsData.testCategories;
    var names = {};
    for (var i=0; i<categories.length; i++) {
        result[categories[i].name] = true;
    }
    return result;
}

function getCategoryWithName(name) {
    var categories = testsData.testCategories;
    for (var i=0; i<categories.length; i++) {
        var cat = categories[i];
        if (cat.name == name) {
            return cat;
        }
    }
    return null;
}


function categoryExists(name) {
    var idMap = getCategoryIdMap();
    return !!idMap[name];
}

function getUniqueCategoryName() {
    var idMap = getCategoryIdMap();
    for (var i=1; i<100; i++) {
        var name = "Category " + i;
        if (!idMap[name]) {
            return name;
        }
    }
    // This is a solution for those really strange cases :)
    for (var i=0; i<100; i++) {
        var name = "Category " + Math.round(1 + Math.random() * 99999999);
        if (!idMap[name]) {
            return name;
        }
    }
    return "Category";
}



function TestInfoCategory() {
    this.name = "";
    this.testInfos = [];
    this._constructorName = "TestInfoCategory";
}

function TestInfo() {
    this.name = "";
    this.template = ""; // Constructor name
    this.parameterValues = {};
    this._constructorName = "TestInfo";
}