const memoization = require('./memoization.tsx');
const expect = require('chai').expect;
var sinon = require('sinon');


let returnValue = 5;
const testFunction =  (key) => returnValue;
var clock = sinon.useFakeTimers();

function testArguments (key, a, b){
    return a+b+returnValue;
}

function resolver (key, ...args) {
    return 1;
}

describe('memoization', function () {
    // Tests if value remains in cache. Currently working.
    it('1) should memoize function result', () =>{ 
        
        const memoized = memoization.memoize(testFunction, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
    });
    // Tests if value in cache is accorded to the last change, and if it was properly deleted from cache after timeout. Currently working.
    it('2) After 1 second, should memoize function result ', () =>{ 
        clock.tick (1000);
        const memoized = memoization.memoize(testFunction, 2000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);

        returnValue = 15;
        clock.tick (2000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);
    });

    // Tests if values are saved in cache under resolver's key. Currently working.
    it('3) should memoize with resolver function result', () =>{
        
        const memoized = memoization.memoize(testFunction, 3000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);

        returnValue = 7;

        expect(memoized(1)).to.equal(15);
    });
    // Tests if value in cache under resolver's key is accorded to the last change, and if it was properly deleted from cache after timeout. Currently working.
    it('4) After 3 seconds, should memoize function with resolver result ', () =>{ 
        clock.tick (3000);
        const memoized = memoization.memoize(testFunction, 4000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(7);

        returnValue = 20;
        clock.tick (4000);
        expect(memoized(1)).to.equal(20);
    });
    // Tests if previous functionality works with an undefined number of parameters. Currently working.
    it('5) Should memoize function with parameters and resolver result ', () =>{ 
        clock.tick (4000);
        const memoized = memoization.memoize(testArguments, 5000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 4, 5)).to.equal(29);

        returnValue = 30;
        clock.tick (5000);
        expect(memoized(1, 4, 5)).to.equal(39);
    });
    // Warnings that the number of arguments recieved is different that what our function is expecting. 
    it('6) Should memoize function with inconsistent number of parameters result ', () =>{ 
        clock.tick (4000);
        const memoized = memoization.memoize(testArguments, 5000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 4, 5)).to.equal(39);

        returnValue = 30;
        clock.tick (5000);
        expect(memoized(1, 4)).to.equal(false);
    });

    // TODO additional tests required
});