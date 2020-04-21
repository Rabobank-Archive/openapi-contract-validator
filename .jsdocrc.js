module.exports = {
    tags: {
        'allowUnknownTags': true,
    },
    source: {
        include: [
            './src',
        ],
        includePattern: '.+\.js(x|doc)?$',
    },
    plugins: [
        'plugins/markdown',
    ],
    opts: {
        encoding: 'utf8',
        destination: './documentation',
        recurse: true,
        verbose: false,
        readme: './README.md',
        template: 'node_modules/docdash',
    },
    docdash: {
        search: true,
    },
    markdown: {
        parser: 'gfm',
        hardwrap: true,
    },
};
