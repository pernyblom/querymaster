

function createFilledNumericIncArray(count, element, inc) {
    var result = [];
    for (var i=0; i<count; i++) {
        result.push(element);
        element += inc;
    }
    return result;
}


function getProbabilityDistribution(likelihoods) {
    var result = [];

    var length = likelihoods.length;

    var sum = 0.0;
    for (var i = 0; i < length; i++) {
        sum += parseFloat(likelihoods[i]);
    }

    result[0] = likelihoods[0];
    for (var i = 1; i < length; i++) {
        result[i] = (result[i - 1] + likelihoods[i]);
    }
    if (sum > 0.000000001) {
        for (var i = 0; i < length; i++) {
            result[i] /= sum;
        }
    } else {
        // Setting all to the same person
        var increment = 1.0 / length;
        for (var i = 0; i < length; i++) {
            result[i] = (i+1) * increment;;
        }
    }
    return result;
}


function sampleDataIndex(rndInfos, rnd) {
    var info = {};
    var likelihoods = [];
    for (var j=0; j<rndInfos.length; j++) {
        if (typeof(rndInfos[j].active) != 'undefined') {
            likelihoods[j] = rndInfos[j].active ? rndInfos[j].likelihood : 0;
        } else {
            likelihoods[j] = rndInfos[j].likelihood;
        }
    }
    var dist = getProbabilityDistribution(likelihoods);
    var index = sampleIndexIntegerDistribution(rnd, dist);

    return index;
}

function sampleData(rndInfos, rnd) {
    var index = sampleDataIndex(rndInfos, rnd);
    var rndInfo = rndInfos[index];
    return rndInfo.data;
}

function sampleNData(rndInfos, n, rnd) {
    var result = [];
    for (var i=0; i<n; i++) {
        result.push(sampleData(rndInfos, rnd));
    }
    return result;
}

function sampleNDataWithoutReplacement(rndInfos, n, rnd, replace) {
    var result = [];

    if (!replace) {
        rndInfos = arrayCopy(rndInfos);
    }
    n = Math.min(rndInfos.length, n);
    if (n == rndInfos.length) {
        for (var i=0; i<rndInfos.length; i++) {
            result.push(rndInfos[i].data);
        }
    } else {
        for (var i=0; i<n; i++) {
            var index = sampleDataIndex(rndInfos, rnd);
            var rndInfo = rndInfos[index];
            var data = rndInfo.data;
            result.push(data);
            rndInfos.splice(index, 1);
        }
    }
    return result;
}


function sampleIndexIntegerDistribution(rnd, cumulative) {
    var rndValue = rnd.random();
    for (var j = 0; j < cumulative.length; j++) {
        if (rndValue < cumulative[j]) {
            return j;
        }
    }
    console.log("utils.js: Could not properly sample "
        + cumulative);
    return 0; // This should never happen
}

function arrayCopy(arr) {
    if (arr) {
        var result = [];
        for (var i=0; i<arr.length; i++) {
            result.push(arr[i]);
        }
        return result;
    }
    return null;
}




var isValidFunctionName = function() {
    var validName = /^[$A-Z_][0-9A-Z_$]*$/i;
    var reserved = {
        'abstract':true,
        'boolean':true,
        // ...
        'with':true
    };
    return function(s) {
        // Ensure a valid name and not reserved.
        return validName.test(s) && !reserved[s];
    };
}();


function copyObjectPropertiesDeep(copy, source, options) {
    for (var propName in source) {
        var value = source[propName];
        if (! (typeof(value) === 'function')) {
            copy[propName] = copyValueDeep(value, source, options);
        } else {
            copy[propName] = value;
        }
    }
}


function copyObjectDeep(obj, options) {
    if (typeof(obj) === 'undefined' || obj == null) {
        return obj;
    }
    var copy = null;
    if (!obj._constructorName) {
        copy = {};
    } else {
        if (isValidFunctionName(obj._constructorName)) {
            copy = eval("new " + obj._constructorName + "()");
        } else {
            copy = {};
        }
    }
    copyObjectPropertiesDeep(copy, obj, options);

    return copy;
}


function copyValueDeep(value, options) {
    if (_.isArray(value)) {
        var result = [];
        for (var i=0; i<value.length; i++) {
            result[i] = copyValueDeep(value[i], options);
        }
        return result;
    } else if (typeof(value) === 'function') {
        return value;
    } else if (typeof(value) === 'object') {
        return copyObjectDeep(value, options);
    } else {
        return value;
    }
}



function getGlobalFunction(name) {
    return window[name];
}

function parseUrlParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}

if (String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
