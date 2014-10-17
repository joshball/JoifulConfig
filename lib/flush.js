'use strict';

var _ = require('lodash');
var log = require('./log');

var flushAll = function (tags, configSections) {

    var flushedConfigSections = {};

    _.forEach(configSections, function (configEnvironmentValue, configSection) {
        var flushedConfigSection = {};
        var prevEnvConfig = {};

        _.forEach(tags, function (tagName) {
            //var configForEnv = configEnvironmentValue[tagName];
            //prevEnvConfig = _.extend(prevEnvConfig, configEnvironmentValue[tagName]);
            if(configEnvironmentValue[tagName] && configEnvironmentValue[tagName].__doExtendFromParent){
                prevEnvConfig = {};
            }
            prevEnvConfig = _.merge(prevEnvConfig, configEnvironmentValue[tagName]);
            flushedConfigSection[tagName] = _.cloneDeep(prevEnvConfig);
        });

        flushedConfigSections[configSection] = flushedConfigSection;
    });
    return flushedConfigSections;
};

var flushTag = function (tags, tag, configSections) {
    if(!_.contains(tags, tag)){
        throw new Error('Invalid tag:' + tag);
    }
    var flushedConfig = flushAll(tags, configSections);
    _.forEach(flushedConfig, function(value, key, obj){
        flushedConfig[key] = value[tag];
    });
    return flushedConfig;
};

module.exports = {
    all: flushAll,
    tag: flushTag
};