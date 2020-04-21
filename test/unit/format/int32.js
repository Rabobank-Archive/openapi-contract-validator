const _ = require('lodash');
const format = require('../../../src/format/int32');

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
    describe('int32', function() {
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

            expect(names).to.deep.equal(['int32'].sort());
        });

        it('has the correct data type', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.type).to.equal('integer');
                });
        });

        it('matches a valid int32', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn(3654)).to.be.true;
                    expect(format.fn(-35168542)).to.be.true;
                    expect(format.fn(-(2 ** 31))).to.be.true;
                    expect(format.fn(2 ** 31 - 1)).to.be.true;
                });
        });

        it('does not match an invalid int32', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn(3654.12)).to.be.false;
                    expect(format.fn(-(2 ** 32))).to.be.false;
                    expect(format.fn(2 ** 32)).to.be.false;
                    expect(format.fn(undefined)).to.be.false;
                    expect(format.fn(null)).to.be.false;
                    expect(format.fn(NaN)).to.be.false;
                });
        });
    });
});
