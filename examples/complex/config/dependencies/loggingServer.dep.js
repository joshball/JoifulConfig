
var dependency = {
    production: { host: 'log.example.com', port: 80 },
    stage: { host: 'log.dev.heroku.com', port: 80 },
    local: { host: 'localhost', port: 9990 }
};

module.exports = dependency;