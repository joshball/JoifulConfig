var Joi = require('joi');

var mod = {
    host:    { __tmpl: '{{dependencies.loggingServer.host}}:{{ dependencies.loggingServer.port}}', __schema: Joi.string() },
    enabled: { __tmpl: '##:settings.logging.enabled ', __schema: Joi.boolean() },
    level:   { __tmpl: '##:settings.logging.level', __schema: Joi.string() }
};

module.exports = mod;