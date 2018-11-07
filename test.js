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
    it('1) Should memoize function find values cached', () =>{ 
        
        const memoized = memoization.memoize(testFunction, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
    });
    // Tests if value in cache is accorded to the last change, and if it was properly deleted from cache after timeout. Currently working.
    it('2) After timeout, should memoize function return new value not stored', () =>{ 
        clock.tick (1000);
        const memoized = memoization.memoize(testFunction, 2000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);

        returnValue = 15;
        clock.tick (2000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);
    });

    // Tests if values are saved in cache under resolver's key. Currently working.
    it('3) Should memoize function with resolver find values cached', () =>{
        
        const memoized = memoization.memoize(testFunction, 3000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);

        returnValue = 7;

        expect(memoized(1)).to.equal(15);
    });
    // Tests if value in cache under resolver's key is accorded to the last change, and if it was properly deleted from cache after timeout. Currently working.
    it('4) After timeout, should memoize function with resolver return new value not stored ', () =>{ 
        clock.tick (3000);
        const memoized = memoization.memoize(testFunction, 4000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(7);

        returnValue = 20;
        clock.tick (4000);
        expect(memoized(1)).to.equal(20);
    });
    // Tests if previous functionality works with an undefined number of parameters. Currently working.
    it('5) Should memoize function with undefined number of parameters and resolver function sent result ', () =>{ 
        clock.tick (4000);
        const memoized = memoization.memoize(testArguments, 5000, resolver);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 4, 5)).to.equal(29);

        returnValue = 30;
        clock.tick (5000);
        expect(memoized(1, 4, 5)).to.equal(39);
    });
    // Tests that the number of arguments recieved is equal to the number our function is expecting. Currently working.
    it('6) Should memoize function with inconsistent number of parameters result ', () =>{ 
        clock.tick (5000);
        const memoized = memoization.memoize(testArguments, 6000);
        expect(() => memoized(1)).to.throw('Number of arguments sent is not compatible with number of arguments expected.');
    });
    // Tests that the timeout recieved does not excede out maximum timeout allowed. In this case: 30sec. 
    it('7) Should memoize function with larger timeout than allowed result ', () =>{ 
        expect(() => memoization.memoize(testFunction, 50000)).to.throw('Maximum timeout exceded');
    });
    // Tests that the function recieved is actually a function.
    it('8) Should memoize be called without a function result ', () =>{ 
        expect(() => memoization.memoize(50000)).to.throw('No function recieved.');
    });
    // Tests that if resolver is recieved it is actually a function.
    it('9) Should memoize be called with a resolver which is not a function result ', () =>{ 
        expect(() => memoization.memoize(testFunction, 5000, 'this is a String')).to.throw('No function recieved.');
    });

    // TODO additional tests to be implemented but did not have time:
    // - Use Typescript to check that the type of the arguments are according to what our function needs. 
});