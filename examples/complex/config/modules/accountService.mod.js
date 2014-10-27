'use strict';
var Joi = require('joi');

var mod = {
    mongo: {
        host:       { __tmpl: '##:dependencies.mongoAccount.host',      __schema: Joi.string() },
        port:       { __tmpl: '##:dependencies.mongoAccount.port',      __schema: Joi.number().min(1).max(65535) },
        database:   { __tmpl: '##:dependencies.mongoAccount.database',  __schema: Joi.string() },
        username:   { __tmpl: '##:dependencies.mongoAccount.username',  __schema: Joi.string().optional() },
        password:   { __tmpl: '##:dependencies.mongoAccount.password',  __schema: Joi.string().optional() }
    },
    mongoUrl: function(){
        var usernamePassword = this.mongo.username ? this.mongo.username + ':' + this.mongo.password  + '@': '';
        return 'mongodb://' + usernamePassword + this.mongo.host + ':' + this.mongo.port + '/' + this.mongo.database;
    }
    //mongoUrl: { __tmpl: 'http://<%= dependencies.server.host %>:<%= dependencies.server.port %>', schema: Joi.string() },
};

module.exports = mod;