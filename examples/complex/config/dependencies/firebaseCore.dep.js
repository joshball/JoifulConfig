
var dependency = {
    production: { host: 'prod.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } },
    development: { host: 'dev.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } },
    localTest: { host: 'test.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } }
};

module.exports = dependency;