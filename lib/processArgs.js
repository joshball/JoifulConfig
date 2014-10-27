'use strict';

var envBuilder = require('./envBuilder');
var io = require('./io');
//var log = require('./log');
var path = require('path');

var processArgs = function(environmentArg, overrideArg){
    var configDir = overrideArg && overrideArg.configDir ? overrideArg.configDir : 'config';
    configDir = path.join('.', configDir);
    configDir = path.resolve(configDir);
    //log.dumpObject('environmentArg', environmentArg);
    //log.dumpObject('overrideArg', overrideArg);
    //log.dumpObject('configDir', configDir);
    var args = {
        environment: undefined,
        environments: undefined,
        envFile: undefined,
        configDir: configDir,
        overrides: overrideArg
    };

    var processNodeEnv = process.env.NODE_ENV;
    var environmentsFile = io.loadEnvironmentsFile(args.configDir);

    var builtEnvironments = envBuilder.buildEnvironments(environmentsFile);

    args.envFile = builtEnvironments;

    args.environmentNames = Object.keys(builtEnvironments.environments);
    args.dependencyTags = Object.keys(builtEnvironments.dependencyTags);
    args.behaviorTags = Object.keys(builtEnvironments.behaviorTags);

    if(!environmentArg){
        args.environment = builtEnvironments.environments[processNodeEnv];
    }
    else if (typeof environmentArg === 'string' || environmentArg instanceof String){
        args.environment = builtEnvironments.environments[environmentArg];
    }
    else {
        console.error('Invalid Args.environmentArg:\n', JSON.stringify(environmentArg, undefined, 4));
        console.error('Invalid Args.overrideArg:\n', JSON.stringify(overrideArg, undefined, 4));
        throw new Error('Invalid Arguments');
    }

    if(!args.environment){
        console.error('unknown environmentArg:', environmentArg);
        throw new Error('unknown environmentArg:', environmentArg);
    }
    return args;
};

module.exports = processArgs;