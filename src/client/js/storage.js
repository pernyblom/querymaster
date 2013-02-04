

function AbstractStorage(options) {
    this.id = null;
    this.storagePrefix = "";
    this._constructorName = "AbstractStorage";
}

AbstractStorage.prototype.getStoragePropertyName = function() {
    return this.storagePrefix + this._constructorName + (this.id ? "_" + this.id : "");
};


AbstractStorage.prototype.load = function(callback) {
    this.loadFromLocalStorage(callback);
};

AbstractStorage.prototype.save = function(callback) {
    this.saveToLocalStorage(callback);
};


AbstractStorage.prototype.loadFromLocalStorage = function(callback) {

    try {
        var lsPropName = this.getStoragePropertyName();
        var jsonObj = JSON.parse(localStorage.getItem(lsPropName));

        if (jsonObj) {
            for (var prop in this) {
                var value = jsonObj[prop];
                if (typeof(value) != 'undefined') {
                    this[prop] = value;
                }
            }
        }
        callback(null);
    } catch (exc) {
        // Just silently ignore this
        console.log("Error when loading from local storage " + this._constructorName);
        callback(exc);
    }
};

AbstractStorage.prototype.saveToLocalStorage = function(callback) {
    try {
        var toStore = {};
        for (var prop in this) {
            var value = this[prop];
            if (!isFunction(value)) {
                toStore[prop] = value;
            }
        }
        var lsPropName = this.getStoragePropertyName();
        localStorage.setItem(lsPropName, JSON.stringify(toStore));
        callback(null);
    } catch (exc) {
        // Silently ignore
        console.log("Error when saving to local storage " + this._constructorName);
        callback(exc);
    }
};


function StorageWrapper() {
    AbstractStorage.call(this);
    this.object = null;
    this._constructorName = "StorageWrapper";
}
StorageWrapper.prototype = new AbstractStorage();


