
var dependency =  {
    production: { host: 'example.com', port: 80 },
    stage: { host: 'stage.heroku.com', port: 80 },
    development: { host: 'dev.heroku.com', port: 80 },
    local: { host: 'localhost', port: 9999 }
};

module.exports = dependency;