const _ = require('lodash');
const format = require('../../../src/format/byte');

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
    describe('byte', function() {
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

            expect(names).to.deep.equal(['byte'].sort());
        });

        it('has the correct data type', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.type).to.equal('string');
                });
        });

        it('matches a valid byte', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn('Zm9v')).to.be.true;
                    expect(format.fn('TG9ydW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQ=')).to.be.true;
                });
        });

        it('does not match an invalid byte', function() {
            this.validator.formats
                .forEach((format) => {
                    expect(format.fn('18-04-08')).to.be.false;
                    expect(format.fn(123456)).to.be.false;
                    expect(format.fn(undefined)).to.be.false;
                    expect(format.fn(null)).to.be.false;
                    expect(format.fn(NaN)).to.be.false;
                });
        });
    });
});
