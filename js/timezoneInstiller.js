// some Date functions use UTC time instead of the user's current timezone. this file overrides certain Date functions to use the user's current timezone instead.

// wrap the original toISOString function and modify its behavior
const originalToISOString = Date.prototype.toISOString;
Date.prototype.toISOString = function() {
    let date = new Date(this.getTime() - this.getTimezoneOffset() * 60000);
    return originalToISOString.call(date);
};

// wrap the original constructor function and modify its behavior
const originalConstructor = Date.prototype.constructor;
Date.prototype.constructor = function(dateString) {
    let date = new Date(dateString);
    return new originalConstructor(date.getTime() - date.getTimezoneOffset() * 60000);
};