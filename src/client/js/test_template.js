
function loadTestTemplate(templateInfo) {
//    console.log("loading test template");
//    console.log(templateInfo);
    $.ajax('test_templates/' + templateInfo.path + '/template.js', {
        complete: function(jqXhr, textStatus) {
//            console.log("init test template");
            if (textStatus == "success") {
                try {
                    $.globalEval(jqXhr.responseText);
                    var constrFunc = getGlobalFunction(templateInfo.constructorName);
                    if (constrFunc) {
                        var template = new constrFunc(templateInfo.path);
                        template.initialize(function(err) {
                            if (!err) {
                                testTemplates.push(template);
                            } else {
                                console.log("Error when initializing template ");
                                console.log(templateInfo);
                                console.log(err);
                            }
                        });
                    } else {
                        console.log("Could not find template constructor " + templateInfo.constructorName);
                    }
                } catch (exc) {
                    console.log("Error when loading template ");
                    console.log(templateInfo);
                    console.log(exc);
                }
            } else {
                console.log("Failed to load test template " + textStatus);
                console.log(templateInfo);
            }
        },
        dataType: "text",
        type: 'GET'});
}


function findTemplate(name) {
    for (var i=0; i<testTemplates.length; i++) {
        var t = testTemplates[i];
        if (t._constructorName == name) {
            return t;
        }
    }
    return null;
}



function TestTemplate(displayName, path) {
    this.displayName = displayName;
    this.localizationData = null;
    this.path = path;
    this.description = "";
    this.parameters = []; // Shown before running test if not already set.
    this.dataParameters = []; // Not shown before running test. Used for glossary strings etc. Shown when test is edited
    this.initialized = false;
    this._constructorName = "TestTemplate";
}
TestTemplate.prototype.getTest = function(testInfo) {
    return new Test(this, testInfo);
};
TestTemplate.prototype.addQuestions = function(test, testInfo) {
};

TestTemplate.prototype.initializeLocalization = function(callback) {
    try {
        var that = this;
        $.ajax("test_templates/" + that.path + "/locale_" + language + ".json", {
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    that.localizationData = $.parseJSON(jqXhr.responseText);
                } else {
                    console.log(that._constructorName + " could not find locale file for language " + language);
                }
                if (callback) {
                    callback(null);
                }
            },
            type: 'GET'});
    } catch (exc) {
        callback(exc);
    }
};


TestTemplate.prototype.initialize = function(callback) {
    if (!this.initialized) {
        // Do things like load resources etc. here

        // ... and then do the following when done:
        this.initialized = true;
        if (callback) {
            callback(null); // Send any error through the callback
        }
    } else {
        if (callback) {
            callback(null);
        }
    }
};


TestTemplate.prototype.getOrCreateValueFunctionIfNecessary = function(funcName, params) {
    var func = params[funcName];
    if (!func) {
        var def = params[funcName + "Def"];
        if (def) {
            try {
                if (_.isArray(def)) {
                    def = def.join("");
                }
                func = eval("var temp = " + def + "; temp;");
            } catch (exc) {
                console.log("Error when evaluating value function definition " + funcName);
                console.log(def);
                console.log(exc);
                func = function() {
                    return 0;
                }
            }
        } else {
            console.log("Could not find function for first value...");
            func = function() {
                return 0;
            }
        }
        params[funcName] = func;
    }
    return func;
}



TestTemplate.prototype.getParameters = function() {
    return this.parameters;
};

TestTemplate.prototype.getDataParameters = function() {
    return this.dataParameters;
};



