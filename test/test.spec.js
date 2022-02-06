const { expect } = require('chai');

describe('testunit#', function () {
    it('passed case', function () {
        expect(1).to.be.equal(1);
    });
    it('failed case', function () {
        expect(1).to.be.equal(2);
    });
    it('passed case with duration of 50ms', function (done) {
        setTimeout(function() {done();},55);
    });
    it.skip('skipped case', function (done) {
        setTimeout(function() {done();},55);
    });
});
