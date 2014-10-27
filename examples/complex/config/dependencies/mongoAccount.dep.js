
var dependency = {
    production: { host: 'mongohq.com', port: 18000, database: 'prod_db',  username: 'user', password: { __envVar: 'MONGODB_PASSWORD' } },
    stage:      { host: 'mongohq.com', port: 18000, database: 'stage_db' },
    development:{ host: 'mongohq.com', port: 18000, database: 'dev_db',  username: 'foo', password: 'bar' },
    local:      { host: 'localhost',   port: 17001, database: 'dev_db',  __doExtendFromParent: true }
};

module.exports = dependency;