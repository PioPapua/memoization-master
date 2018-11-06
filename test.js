const memoization = require('./memoization.tsx');
const expect = require('chai').expect;


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

function resolver (key) {
    return 1;
}

describe('memoization', function () {
    // Tests if value remains in cache. Currently working.
    it('should memoize function result', () =>{ 
        
        const memoized = memoization.memoize(testFunction, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
    });
    // Tests if value in cache is accorded to the last change, and if it was properly deleted from cache after timeout. Currently failing.
    it('After 2 seconds, should memoize function result ', () =>{ 
        
        const memoized = memoization.memoize(testFunction, 2000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);

        returnValue = 15;
        sleep (2001);

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);
    });

    // Tests if values are saved in cache under resolver's key. Currently working.
    it('should memoize with resolver function result', () =>{
        
        const memoized = memoization.memoize(testFunction, 10000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);

        returnValue = 7;

        expect(memoized(1)).to.equal(15);
    });

    // TODO additional tests required
});