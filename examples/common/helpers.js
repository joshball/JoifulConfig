'use strict';
var path = require('path');

var getEnvironmentArray = function(){
    var environmentsConfig = require(path.resolve('./config/environments'));
    return Object.keys(environmentsConfig.environments);
};

var setEnvironmentVars = function(env){

    var createValue = function(envVar){
        return envVar+ '__' + env;
    };
    process.env.NODE_ENV = env;
    process.env.PODIO_AUTH_KEY_SECRET = createValue('podio_secret_key');
    process.env.PODIO_AUTH_SURVEY_TOKEN = createValue('podio_survey_token');
    process.env.SINGLY_CLIENT_SECRET = createValue('singly_secret');
    process.env.MONGODB_PASSWORD = createValue('mongo password');
    process.env.FIREBASE_TOKEN = createValue('firebase token');
};

module.exports = {
    getEnvironmentArray: getEnvironmentArray,
    setEnvironmentVars: setEnvironmentVars
};