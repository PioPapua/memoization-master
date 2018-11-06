const cache = [];

function memoize(someFunction, timeout, resolver) { 
    // Pending: access someFunction first parameter to set a default value for key.
    let key = 'c544d3ae-a72d-4755-8ce5-d25db415b776';

    (resolver !== undefined) ? (key = resolver (key)) : key;

    return (key, args) => {
        if (key in cache) {
            return cache[key];
        }
        else {
            const result = someFunction(key, args);
            cache[key] = result;
            setTTL(cache, key, timeout);
            return result;
        }
    };
}

// After timeout, if accessing cache[key] result will be undefined.
function setTTL(cache, key, timeout) {
    let timer;
    clearTimeout(timer);
    timer = setTimeout ( function () {
        delete cache[key];
    }, timeout);
}

module.exports = {
    memoize,
};