'use strict';
var Joi = require('joi');

var mod = {
    firebase: {
        host:    { __tmpl: '##:dependencies.firebaseCore.host',      __schema: Joi.string() },
        account: { __tmpl: '##:dependencies.firebaseCore.account',      __schema: Joi.string() },
        token:   { __tmpl: '##:dependencies.firebaseCore.token',      __schema: Joi.string() }
    }
};

module.exports = mod;