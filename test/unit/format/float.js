const _ = require('lodash');
const format = require('../../../src/format/float');

const mockValidator = {
    formats: [],
    addFormat: function(name, format) {
        this.formats.push({
            name,
            type: format.type,
            fn: format.validate,
        });
    },
};

bundle('OAS format', function() {
    describe('float', function() {
        beforeEach(function() {
            const validator = _.cloneDeep(mockValidator);
            format(validator);
            this.validator = validator;
        });

        it('has the correct name', function() {
            expect(this.validator.formats).to.be.lengthOf(1);

            const names = this.validator.formats
                .map((o) => o.name)
                .sort();

            expect(names).to.deep.equal(['float'].sort());
        });

        it('has the correct data type', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.type).to.equal('number');
                });
        });

        it('matches a valid float', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn(123.12)).to.be.true;
                    expect(format.fn(456)).to.be.true;
                });
        });

        it('does not match an invalid float', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn('foo')).to.be.false;
                    expect(format.fn(Infinity)).to.be.false;
                    expect(format.fn(-Infinity)).to.be.false;
                    expect(format.fn(undefined)).to.be.false;
                    expect(format.fn(null)).to.be.false;
                    expect(format.fn(NaN)).to.be.false;
                });
        });
    });
});
