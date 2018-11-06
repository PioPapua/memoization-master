const cache = [];

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

function memoize(someFunction, timeout, resolver) { 
    // Pending: access someFunction first parameter to set a default value for key.
    let key = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
    (resolver !== undefined) ? (key = resolver(key)) : key;

    return (key, args) => {
        if (key in cache) {
            console.log('Key: ' + key);
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
// TODO: My cache is not the same cache that is used by memoize. Changed values never return.
function setTTL(cache, key, timeout) {
    let timer;
    timer = setTimeout ( function () {
        sleep (timeout);
        delete cache[key];
    });
}

module.exports = {
    memoize,
};