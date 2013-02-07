
function localizeProperty(locProperty, defaultText, data) {
    if (!data) {
        data = localizationData;
    }
    if (data) {
        var text = data[locProperty];
        if (text) {
            return text;
        }
    }
    if (language != "en") {
        console.log("Could not find language string for " + locProperty + " language: " + language);
    }
    return defaultText;
}

function localizeJQuery($content, data) {
    if (!data) {
        data = localizationData;
    }
    if (data) {
        $content.each(function() {
            var locProperty = $(this).data('loc');
            this.innerHTML = localizeProperty(locProperty, this.innerHTML, data);
        });
    }
}

function localizeStatic() {

    $.ajax("locale/locale_" + language + ".json", {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                    localizationData = $.parseJSON(jqXhr.responseText);
                    localizeJQuery($("[data-loc]"));
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
