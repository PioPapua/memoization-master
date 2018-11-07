var sinon = require('sinon');

const cache = [];

function memoize(someFunction, timeout, resolver) { 
    return (key, ...args) => {
        let maskedKey = key
        if (resolver != undefined) {
            maskedKey = resolver(key, ...args);
        };
        if (cache[maskedKey] != undefined) {
            const result = someFunction(key, ...args);
            return cache[maskedKey];
        }
        else {
            const result = someFunction(key, ...args);
            if ((someFunction.length-1) != args.length) return false;
            cache[maskedKey] = result;
            const fakeTime = setTTL(maskedKey, timeout);
            fakeTime();
            return result;
        }
    };
}

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