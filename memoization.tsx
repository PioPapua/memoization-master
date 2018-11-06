var sinon = require('sinon');

const cache = [];

function memoize(someFunction, timeout, resolver) { 

    return (key, args) => {
        let maskedKey = key
        if (resolver != undefined) {
            maskedKey = resolver(key);
        };
        if (cache[maskedKey] != undefined) {

            return cache[maskedKey];
        }
        else {
            const result = someFunction(key, args);
            cache[maskedKey] = result;
            const fakeTime = setTTL(maskedKey, timeout);
            fakeTime();
            return result;
        }
    };
}

// After timeout, if accessing cache[key] result will be undefined.
// Function has been changed to include sinonJS functions.
function setTTL(key, timeout) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            delete cache[key];
        }, timeout);
    }
}

module.exports = {
    memoize,
};