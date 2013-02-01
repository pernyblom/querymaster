
function isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
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
