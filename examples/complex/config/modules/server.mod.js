var Joi = require('joi');

var mod = {
    host: { __tmpl: 'http://{{dependencies.server.host}}:{{dependencies.server.port}}', __schema: Joi.string() },
    shutdownTimeoutInMs: { __tmpl: '##:settings.server.shutdownTimeout ', __schema: Joi.number().integer().min(0).max(30*1000) },
    hapiOptions: {
        __tmpl: '##:settings.hapiOptions',
        __schema: Joi.object().keys({
            debug: Joi.object().keys({
                request: Joi.array()
            }).optional()
        })
    },
    getHapiOptions: function(){
        var hapiOptionsDebugOptions = {};
        if(this.loggingEnabled){
            hapiOptionsDebugOptions = ['hapi', 'implementation'];
            this.constants.loggingLevels.forEach(function(level){
                hapiOptionsDebugOptions.push(level);
                if(level === this.settings.loggingLevel){
                    return false;
                }
            });
        }
        return {
            debug: hapiOptionsDebugOptions
        };
    }
};

module.exports = mod;