var constants ={
    assets: {
        paths:{
            root: '/assets',
            scripts: '{{constants.assets.paths.root}}/scripts',
            styles: '{{constants.assets.paths.root}}/styles',
            images: '{{constants.assets.paths.root}}/images',
            vendor: '{{constants.assets.paths.root}}/vendor'
        }
    },
    monthInMs: 1000*60*60*24*30,
    api:{
        rootPath: '/api'
    },
    loggingLevels: ['error', 'warn', 'info', 'debug', 'trace']
};

module.exports = constants;