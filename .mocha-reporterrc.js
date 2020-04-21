module.exports = {
    reporterEnabled: 'spec, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
        mochaFile: 'junit-report.untracked.xml',
        includePending: true,
        toConsole: false,
    },
};
