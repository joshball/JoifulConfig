
var dependency =  {
    production: { host: 'api.singly.com', client_id: 'SinglyClientId', client_secret: { __envVar: 'SINGLY_CLIENT_SECRET' } },
    development: { host: 'api.singly.com', client_id: 'SinglyClientTestId', client_secret: { __envVar: 'SINGLY_CLIENT_SECRET' } }
};

module.exports = dependency;