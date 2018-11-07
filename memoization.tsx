var sinon = require('sinon');

const cache = [];
const maxTimeout = 30000;

function error (message){
    console.log('Error catched: ' + message);
}
// We do not want our function to return a boolean without noticing that an error has been made. New tests will pass when the proper error is thrown. But when a function is runned, if an error occurs, it will throw the error and not run nicely.
function memoize(someFunction, timeout, resolver) { 
    if (timeout > maxTimeout) {
        throw new Error('Maximum timeout exceded');
    }

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
            if ((someFunction.length-1) != args.length)  {
                throw new Error('Number of arguments sent is not compatible with number of arguments expected.');
            }
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