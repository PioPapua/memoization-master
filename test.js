const memoization = require('./memoization.tsx');
const expect = require('chai').expect;

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts


let returnValue = 5;
const testFunction =  (key) => returnValue;
// Remove function after every test is done.
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

describe('memoization', function () {
    it('should memoize function result', () =>{
        
        const memoized = memoization.memoize(testFunction, 1000, (key) => key);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        // Currently working. Value is saved in cache.
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        console.log('Memoized es: ' + memoized('c544d3ae-a72d-4755-8ce5-d25db415b776'));
        console.log('Return Value es: ' + returnValue);
    });

    it('After 6 seconds, should memoize function result', () =>{
        
        //TODO Currently not working. Value 5 must have been removed from cache, but memoized still returns 5.
        sleep (6000);
        const memoized = memoization.memoize(testFunction, 5000, (key) => key);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
    });

    // TODO additional tests required
});