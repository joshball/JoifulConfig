'use strict';

var _ = require('lodash');
//var log = require('./log');

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

var createEnv = function(name, dependencyTag, behaviorTag){
    //log('createEnv: [%s, dependencyTag: %s, behaviorTag: %s]', name, dependencyTag.name, behaviorTag.name);
    return {
        name: name,
        dependencyTag: dependencyTag,
        behaviorTag: behaviorTag,
        toString: function () {
            return this.name + '{dep: ' + this.dependencyTag + ', behavior: ' + this.behaviorTag + '}';
        }
    };
};

var createEnvironments = function(envConfig){
    var environments = {};
    _.forEach(envConfig, function(val, key){
        //log('createEnvironments: ', key, val);
        environments[key] = createEnv(key, val.dependency, val.behavior);
    });
    return environments;
};

var validateEnvironments = function(environments, dependencyTags, behaviorTags){
    validateTags(dependencyTags);
    validateTags(behaviorTags);
    _.forEach(environments, function(val){
        validateTag(val.dependencyTag, dependencyTags);
        validateTag(val.behaviorTag, behaviorTags);
    });
};

var buildEnvironments = function(environmentsConfig){
    var dependencyTags = environmentsConfig.dependencyTags,
        behaviorTags = environmentsConfig.behaviorTags,
        environments = environmentsConfig.environments;

    var be = {
        environments:  createEnvironments(environments),
        dependencyTags:  createTags(dependencyTags),
        behaviorTags:  createTags(behaviorTags)
    };
    validateEnvironments(be.environments, be.dependencyTags, be.behaviorTags);
    return be;
};

module.exports = {
    createTags: createTags,
    createEnvironments: createEnvironments,
    buildEnvironments: buildEnvironments,
    validate: validateEnvironments
};