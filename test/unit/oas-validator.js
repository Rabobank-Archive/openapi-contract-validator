const Ajv = require('ajv');
const Validator = require('../../src').Validator;
const defaultConfig = require('../../src/default-config.js');

describe('The class Validator', function() {
    it('initializes with an ajv instance', function() {
        const v = new Validator();

        expect(v).to.be.instanceOf(Validator);
        expect(v._ajv).to.be.instanceOf(Ajv);
    });

    it('initializes with default config', function() {
        const v = new Validator();

        expect(v).to.be.instanceOf(Validator);
        expect(v.config).to.deep.equal(defaultConfig);
    });

    it('overwrites default config', function() {
        const v = new Validator({
            requireAllFields: true,
        });

        expect(v).to.be.instanceOf(Validator);
        expect(v.config).to.not.deep.equal(defaultConfig);
        expect(v.config.requireAllFields).to.be.true;
    });

    context('addFormat', function() {
        it('adds a format to AJV', function() {
            const v = new Validator();
            const formatCount = Object.keys(v._ajv._formats).length;

            v.addFormat('foo', () => {});

            expect(Object.keys(v._ajv._formats).length).to.equal(formatCount + 1);
            expect(Object.keys(v._ajv._formats)).to.include('foo');
        });
    });
});
