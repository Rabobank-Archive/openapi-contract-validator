const _ = require('lodash');
const format = require('../../../src/format/binary');

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
    describe('binary', function() {
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

            expect(names).to.deep.equal(['binary'].sort());
        });

        it('has the correct data type', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.type).to.equal('string');
                });
        });

        it('always matches', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn([])).to.be.true;
                    expect(format.fn({})).to.be.true;
                    expect(format.fn('foo')).to.be.true;
                    expect(format.fn(456)).to.be.true;
                });
        });
    });
});
