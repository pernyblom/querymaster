
var TestParameterType = {
    INTEGER: 0,
    DECIMAL: 1,
    BOOLEAN: 2,
    RANGED_INTEGER: 3,
    RANGED_DECIMAL: 4,
    ENUMERATED_INTEGER: 5,
    ENUMERATED_DECIMAL: 6,
    STRING: 7,
    ENUMERATED_STRING: 8,
    INTEGER_RANGE: 9,
    DECIMAL_RANGE: 10
};


function TestParameter(displayLocProperty, propertyName, type, defaultValue, data, verifiers, template) {
    this.displayName = displayLocProperty || "parameter name";
    this.propertyName = propertyName || "parameterName";
    this.type = type || TestParameterType.INTEGER;
    this.defaultValue = defaultValue || 0; // Can be anything
    this.data = data; // Can describe range, enumerations etc.
    this.verifiers = verifiers || [];
    this.template = template;
}

TestParameter.prototype.getHtml = function(arr) {
    var inputId = this.propertyName + '_id';
    var inputType = "text";
    var useInput = true;
    switch (this.type) {
        case TestParameterType.INTEGER:
        case TestParameterType.DECIMAL:
        case TestParameterType.RANGED_INTEGER:
        case TestParameterType.RANGED_DECIMAL:
            inputType = "number";
            break;
    }
    arr.push('<div data-role="fieldcontain">');
    if (useInput) {
        var displayName = localizePropertyWithFallbackCap(this.displayName, this.displayName, this.template.localizationData, localizationData);
        arr.push(
            '<label for="' + inputId + '" >', displayName, '</label>',
            '<input type="' + inputType + '" id="' + inputId + '" value="' + this.defaultValue + '" />');
    }
    arr.push('</div>');
};


TestParameter.prototype.initializeInDom = function($aParent) {
    var inputId = this.propertyName + '_id';


};

TestParameter.prototype.getValue = function($aParent) {
    var inputId = this.propertyName + '_id';
    var $input = $aParent.find("#" + inputId);
    var result = $input.val();

    if (typeof(this.defaultValue) === 'number') {
        result = parseFloat(result);
        if (typeof(result) != 'number' || isNaN(result) || !isFinite(result)) {
            console.log("Setting default value because of " + result + " " + typeof(result) + " " + isNaN(result) + " " + isFinite(result));
            result = this.defaultValue;
        }
    }
    return result;
};


