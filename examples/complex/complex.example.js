'use strict';
var util = require('util');

var joifulConfig = require('../../lib/index');
var environmentsConfig = require('./config/environments');

var helpers = require('../common/helpers');

var envArray = helpers.getEnvironmentArray(environmentsConfig.environments);

var options = require('nomnom')
    .option('debug', {
        abbr: 'd',
        flag: true,
        help: 'show debugging info'
    })
    .option('env', {
        abbr: 'e',
        default: envArray[0],
        help: util.format('environment to create [%s]', envArray),
        callback: function(env) {
            if(envArray.indexOf(env) < 0){
                return util.format('environment must be one of: [%s]', envArray);
            }
        }
    })
    .parse();

helpers.setEnvironmentVars(options.env);

// override environment
var config = joifulConfig(options.env, {debug: options.debug});

//
// you could call this in many different ways:
//
//  var config = joifulConfig(); // uses process.env.NODE_ENV
//  var config = joifulConfig('production'); // explicitly with string
//  var config = joifulConfig({ settings: 'prod', dep: 'production' }); // FUTURE: using settings/dep
//  var config = joifulConfig('production', { configDir: './myConfigDir'}); // with an override configuration

joifulConfig.log.dumpObject('config.modules', config.modules);
