
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
    this.value = this.defaultValue;
    this.data = data; // Can describe range, enumerations etc.
    this.verifiers = verifiers || [];
    this.template = template;
    this.$input = null;
    this.$errorLabel = null;
    this.canBeSetBeforeTest = true;
}

TestParameter.prototype.getHtml = function(arr, addSetControl) {
    var inputId = this.propertyName + '_id';
    var errorLabelId = this.propertyName + '_errorlabel_id';
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
            '<input type="' + inputType + '" id="' + inputId + '" value="' + _.escape(this.value) + '" />');
    }

    if (addSetControl && this.canBeSetBeforeTest) {
        var setFlipId = this.propertyName + '_set_flip_id';
        arr.push(
            '<div></div>',
            '<label for="' + setFlipId + '" >Set before test:</label>',
            '<select id="' + setFlipId + '" data-role="slider">',
            '<option value="yes">Yes</option>',
            '<option value="no">No</option>',
            '</select>');
    }
    arr.push('<span id="' + errorLabelId + '">', '</span>');
    arr.push('</div>');
};

TestParameter.prototype.verifyIntValue = function($aParent, raw) {
    var error = "";
    var intValue = parseInt(raw);
    if (isNaN(intValue)) {
        error = "Invalid integer " + raw;
    }
    if (error && this.$errorLabel) {
        this.$errorLabel[0].innerHTML = error;
    }
};
TestParameter.prototype.verifyFloatValue = function($aParent, raw) {
    var error = "";
    var intValue = parseFloat(raw);
    if (isNaN(intValue)) {
        error = "Invalid decimal " + raw;
    }
    if (error && this.$errorLabel) {
        this.$errorLabel[0].innerHTML = error;
    }
};


TestParameter.prototype.initializeInDom = function($aParent, addSetControl) {
    var inputId = this.propertyName + '_id';
    var errorLabelId = this.propertyName + '_errorlabel_id';

    this.$errorLabel = $aParent.find("#" + errorLabelId);
    this.$input = $aParent.find("#" + inputId);

    switch (this.type) {
        case TestParameterType.INTEGER:
        case TestParameterType.RANGED_INTEGER:
        case TestParameterType.DECIMAL:
        case TestParameterType.RANGED_DECIMAL:
            break;
    }
    var that = this;
    this.$input.on("keydown keypress keyup change", function() {
        var raw = that.$input.val();
        that.$errorLabel[0].innerHTML = "";
        switch (that.type) {
            case TestParameterType.INTEGER:
            case TestParameterType.RANGED_INTEGER:
                that.verifyIntValue($aParent, raw);
                break;
            case TestParameterType.DECIMAL:
            case TestParameterType.RANGED_DECIMAL:
                that.verifyFloatValue($aParent, raw);
                break;
        }
    });

};

TestParameter.prototype.getValue = function($aParent) {
    var inputId = this.propertyName + '_id';
    var result = this.$input.val();

    if (typeof(this.defaultValue) === 'number') {
        result = parseFloat(result);
        if (typeof(result) != 'number' || isNaN(result) || !isFinite(result)) {
            console.log("Setting default value because of " + result + " " + typeof(result) + " " + isNaN(result) + " " + isFinite(result));
            result = this.defaultValue;
        }
    }
    return result;
};


