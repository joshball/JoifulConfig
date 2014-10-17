'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');


var readOrRequireFile = function(directory, fileBaseName){
    var jsFile = path.join(directory, fileBaseName + '.js');
    var jsonFile = path.join(directory, fileBaseName + '.json');
    if(fs.existsSync(jsFile)){
        if(fs.existsSync(jsonFile)){
            throw new Error('Can have only one extension for basename file')
        }
        return require(jsFile);
    }
    else {
        return fs.readFileSync(jsonFile, 'utf8');
    }
};

var readOrRequireFilesInDir = function(configDir, directory, filterKey){
    var dir = path.resolve(path.join(configDir, directory));
    var filesInDir = fs.readdirSync(dir);
    var obj = {};
    _.forEach(filesInDir, function(file){
        var fileBase = path.basename(file, path.extname(file));

        var fileBaseKey = filterKey(fileBase);
        obj[fileBaseKey] = readOrRequireFile(dir, fileBase);
    });
    return obj;
};

var loadDependencies = function(configDir){
    var removeTrailingDep = function(fileBase){
        return path.basename(fileBase, '.dep');
    };

    return readOrRequireFilesInDir(configDir, 'dependencies', removeTrailingDep);
};

var loadModules = function(configDir){
    var removeTrailingMod = function(fileBase){
        return path.basename(fileBase, '.mod');
    };
    return readOrRequireFilesInDir(configDir, 'modules', removeTrailingMod);
};

var loadSettings = function(configDir){
    return readOrRequireFile(configDir, 'settings');
};

var loadConstants = function(configDir){
    return readOrRequireFile(configDir, 'constants');
};

var loadEnvironmentsFile = function(configDir){
    return readOrRequireFile(configDir, 'environments');
};

module.exports = {
    loadEnvironmentsFile: loadEnvironmentsFile,
    loadModules: loadModules,
    loadDependencies: loadDependencies,
    loadSettings: loadSettings,
    loadConstants: loadConstants
};