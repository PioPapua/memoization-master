const cache = [];

function sleep(ms) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > ms){
        break;
      }
    }
  }
// Resolvers and keys must not be initialized in memoize function, but handled within the returned function.
function memoize(someFunction, timeout, resolver) { 

    return (key, args) => {
        if (resolver != undefined) {
            key = resolver(key);
        };
        if (key in cache) {
            return cache[key];
        }
        else {
            const result = someFunction(key, args);
            cache[key] = result;
            setTTL(key, timeout);
            sleep (timeout);
            return result;
        }
    };
}

// After timeout, if accessing cache[key] result will be undefined.
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