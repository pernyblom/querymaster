

function TestTemplate(displayName) {
    this.displayName = displayName;
    this.parameters = []; // Shown before running test if not already set.
    this.dataParameters = []; // Not shown before running test. Used for glossary strings etc. Shown when test is edited
    this.initialized = false;
}
TestTemplate.prototype.getTest = function(parameterValues) {
    return new Test(this, parameterValues);
};
TestTemplate.prototype.addQuestions = function(test, templateParams) {
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
                if (isArray(def)) {
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



