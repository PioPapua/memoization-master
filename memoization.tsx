var sinon = require('sinon');

const cache = [];
const maxTimeout = 30000;
// function error no longer needed.
function memoize(someFunction, timeout, resolver) { 
    if (timeout > maxTimeout) {
        throw new Error('Maximum timeout exceded');
    }
    if (typeof someFunction !== "function" ) {
        throw new Error('No function recieved.');
    }
    if (typeof resolver !== "function" && resolver !== undefined) {
        throw new Error('No function recieved.');
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

// I would have liked to use more functional statements insted of that many imperative statements. But I did not have time enough to clean the code. I decided to focus on thinking more test cases rather than cleaning the memoize code. It is a short code, and even if it doesn't follow all of the Javascript recomended practeces, it should not strongly affect functionality or performance.