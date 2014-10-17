'use strict';

var io = require('./io');
var path = require('path');

var processArgs = function(environmentArg, overrideArg){
    var configDir = overrideArg && overrideArg.configDir ? overrideArg.configDir : 'config';
    configDir = path.join('.', configDir);
    configDir = path.resolve(configDir);
    var args = {
        environment: undefined,
        environments: undefined,
        envFile: undefined,
        configDir: configDir,
        overrides: overrideArg
    };
    var processNodeEnv = process.env.NODE_ENV;
    var envFile = io.loadEnvironmentsFile(args.configDir);
    args.envFile = envFile;
    args.environmentNames = Object.keys(envFile.environments);
    args.dependencyTags = Object.keys(envFile.dependencyTags);
    args.settingsTags = Object.keys(envFile.settingsTags);

    if(!environmentArg){
        args.environment = envFile.environments[processNodeEnv];
    }
    else if (typeof environmentArg === 'string' || environmentArg instanceof String){
        args.environment = envFile.environments[environmentArg];
    }
    //else if (environmentArg.dependencyTag && environmentArg.settingsTag){
    //    args.environment = environmentArg;
    //}
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