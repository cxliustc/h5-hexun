import {extendOwn} from 'UTILS';
describe('extend', function () {
    beforeEach(function (done) {
        this.obj = {
            name: 'lisi',
            age: '28'
        };
        this.temObj = {
            name: 'wanger',
            age: 18,
            job: 'it'
        };
        done();
    });
    it('对象的浅extend', function () {
        expect(extendOwn(this.obj, this.temObj)).to.deep.equal({
            name: 'wanger',
            age: 18,
            job: 'it'
        });
    });
});
