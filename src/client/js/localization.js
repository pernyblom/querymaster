
function localizeProperty(locProperty, defaultText, data) {
    var result = null;
    if (!data) {
        data = localizationData;
    }
    if (data) {
        var text = data[locProperty];
        if (text) {
            result = text;
        }
    }
    if (!result) {
        result = defaultText;
        if (language != "en") {
            console.log("Could not find language string for " + locProperty + " language: " + language);
        }
    }
    return result;
}


function localizePropertyCap(locProperty, defaultText, data) {
    var result = localizeProperty(locProperty, defaultText, data);
    return capitalize(result);
}


function localizePropertyWithFallback(locProperty, defaultText, data, fallbackData) {
    var result = "";
    if (data) {
        result = data[locProperty];
    }
    if (!result) {
        if (fallbackData) {
            result = fallbackData[locProperty];
        }
        if (!result) {
            result = defaultText;
        }
    }
    return result;
}

function localizePropertyWithFallbackCap(locProperty, defaultText, data, fallbackData) {
    var result = localizePropertyWithFallback(locProperty, defaultText, data, fallbackData);
    return capitalize(result);
}

function localizeJQuery($content, data, cap) {
    if (!data) {
        data = localizationData;
    }
    if (data) {
        $content.each(function() {
            var dataProp = 'loc';
            if (cap) {
                dataProp = 'loc-cap';
            }
            var locProperty = $(this).data(dataProp);
            var text = "";
            if (cap) {
                this.innerHTML = localizePropertyCap(locProperty, this.innerHTML, data);
            } else {
                this.innerHTML = localizeProperty(locProperty, this.innerHTML, data);
            }
        });
    }
}

function localizeStatic() {

    $.ajax("locale/locale_" + language + ".json", {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                    localizationData = $.parseJSON(jqXhr.responseText);
                    localizeJQuery($("[data-loc]"), localizationData);
                    localizeJQuery($("[data-loc-cap]"), localizationData, true);
//                } catch (exc) {
//                    console.log("Error when loading locale " + language);
//                    console.log(exc);
//                }
            } else {
                console.log("Could not find locale file for language " + language);
            }
        },
        type: 'GET'});

}
