'use strict';

var _ = require('lodash');

var createTag = function(name, parent){
    return {
        name: name,
        parent: parent
    };
};

var validateTag = function(tag, tags){
    if(!tags[tag]){
        throw new Error('Invalid Tag [' + tag + '] does not exist in tags');
    }
};

var validateTags = function(tags){
    _.forEach(tags, function(value){
        if(value.parent){
            if(!tags[value.parent]){
                throw new Error('Invalid Tag [' + value.name + '] has non existent parent: ' + value.parent);
            }
        }
    });
};

var createTags = function(tagConfig){
    var tags = {};
    _.forEach(tagConfig, function(val){
        tags[val.name] = createTag(val.name, val.parent);
    });
    validateTags(tags);
    return tags;
};

var createEnv = function(name, dependencyTag, settingTag){
    return {
        name: name,
        dependencyTag: dependencyTag,
        settingsTag: settingTag,
        toString: function () {
            return this.name + '{dep: ' + this.dependencyTag + ', settings: ' + this.settingsTag + '}';
        }
    };
};

var createEnvironments = function(envConfig){
    var environments = {};
    _.forEach(envConfig, function(val, key){
        //environments[key] = createEnv(key, val.dependencyTag, val.settingsTag)
        environments[key] = createEnv(key, val.dep, val.settings);
    });
    return environments;
};

var validateEnvironments = function(environments, dependencyTags, settingsTags){
    validateTags(dependencyTags);
    validateTags(settingsTags);
    _.forEach(environments, function(val, key){
        validateTag(val.dependencyTag, dependencyTags);
        validateTag(val.settingsTag, settingsTags);
    });
};

module.exports = {
    createTags: createTags,
    createEnvironments: createEnvironments,
    validate: validateEnvironments
};