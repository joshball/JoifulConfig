'use strict';


var log = require('./log');
//var envVars = require('./envVars');
//var utils = require('./utils');
var processArgs = require('./processArgs');
var processObject = require('./processObject');
var flush = require('./flush');
var io = require('./io');

var joifulConfig = function (environmentArg, overrideArg) {
    if(overrideArg && overrideArg.debug){
        log.setDebug(true);
    }

    var args = processArgs(environmentArg, overrideArg);


    var loadedDependencies = io.loadDependencies(args.configDir),
        loadedSettings = io.loadSettings(args.configDir),
        loadedConstants = io.loadConstants(args.configDir),
        loadedModules = io.loadModules(args.configDir);

    log.dumpObject('loadedDependencies',loadedDependencies);
    var flushedDependencies = flush.tag(args.dependencyTags, args.environment.dependencyTag, loadedDependencies),
        flushedSettings = flush.tag(args.settingsTags, args.environment.settingsTag, loadedSettings);

    log.dumpObject('flushedDependencies',flushedDependencies);
    var config = {
        env: args.environment,
        dependencies: flushedDependencies,
        settings: flushedSettings,
        constants: loadedConstants,
        modules: loadedModules
    };

    processObject(config);
    log.dumpObject('config',config);
    return config;
};
joifulConfig.envBuilder = require('./envBuilder');
joifulConfig.log = require('./log');

module.exports = joifulConfig;