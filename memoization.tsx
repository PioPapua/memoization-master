const cache = [];

function sleep(ms) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > ms){
        break;
      }
    }
  }

// Keys modified by resolver shoud not alter the arguments of the returned function.
function memoize(someFunction, timeout, resolver) { 

    return (key, args) => {
        let maskedKey = key
        if (resolver != undefined) {
            maskedKey = resolver(key);
        };
        if (maskedKey in cache) {
            return cache[maskedKey];
        }
        else {
            const result = someFunction(key, args);
            cache[maskedKey] = result;
            setTTL(maskedKey, timeout);
            return result;
        }
    };
}

// After timeout, if accessing cache[key] result will be undefined.
// cache should not be passed as a function argument if we want to modify my previously defined cache and noy a copy of it.
function setTTL(key, timeout) {
    let timer;
    timer = setTimeout ( function () {
        sleep (timeout);
        delete cache[key];
    });
}

module.exports = {
    memoize,
};