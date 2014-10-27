# JoifulConfig

Server (node only) configuration using nunjucks templating, Joi validations, and separation of physical from logical environments

## Breaking Change (1.0 -> 1.1)
- changed settings/settingsTags/settings.[js|json] to behavior/behaviorTags/behaviors.[js|json]


## Quick Start

Take a look at the example in `examples/complex/`.
Note, the `JoifulConfig.md` goes over the terminology needed to understand dependencies vs behaviors vs constants.

### ENVIRONMENTS

Create an environments file (`examples/complex/config/environments.[js|json]`). It can be either a js or json file. Here is the example that is json:
	
	{
	    "dependencyTags": [
	        {"name":"production"},
	        {"name":"stage", "parent": "production"},
	        {"name":"development", "parent": "stage"},
	        {"name":"local", "parent": "development"},
	        {"name":"localTest", "parent": "local"}
	    ],
	    "behaviorTags": [
	        {"name":"prod"},
	        {"name":"test", "parent": "prod"},
	        {"name":"dev", "parent": "test"}
	    ],
	    "environments": {
	        "production":   { "behavior": "prod", "dependency": "production" },
	        "stage":        { "behavior": "prod", "dependency": "stage" },
	        "development":  { "behavior": "dev",  "dependency": "development" },
	        "local.dev":    { "behavior": "dev",  "dependency": "local" },
	        "local.test":   { "behavior": "test", "dependency": "localTest" }
	    }
	}

This defines three things:
- dependencyTags - physical locations of dependencies
- behaviorTags - behavioral context to run
- environments - tuple of a dependency and behavior


### INPUTS

There are three different types of inputs into the configuration:

- constants
- dependencies
- behaviors



#### Define your constants

Create an constants file (`examples/complex/config/constants.[js|json]`). Here is a JS version:

	var constants ={
	    assets: {
	        paths:{
	            root: '/assets',
	            scripts: '{{constants.assets.paths.root}}/scripts',
	            styles: '{{constants.assets.paths.root}}/styles',
	            images: '{{constants.assets.paths.root}}/images',
	            vendor: '{{constants.assets.paths.root}}/vendor'
	        }
	    },
	    monthInMs: 1000*60*60*24*30,
	    api:{
	        rootPath: '/api'
	    },
	    loggingLevels: ['error', 'warn', 'info', 'debug', 'trace']
	};
	
	module.exports = constants;

This defines constants that are not going to change frequently, but want to be shared across your application.


### Define your behaviors

Create an behaviors file (`examples/complex/config/behaviors.[js|json]`). Here is a JS version:

	var behaviors ={
	    server: {
	        prod: { shutdownTimeout: 3 * 1000 }
	    },
	    hapiOptions: {
	        prod: { debug: { request: ['hapi', 'implementation', 'error', 'warn']} },
	        test: { debug: undefined },
	        dev:  { debug: { request: ['hapi', 'implementation', 'error', 'warn', 'info', 'debug', 'trace']} }
	    },
	    logging: {
	        prod: { enabled: true, level: 'warn' },
	        test:{ enabled: false },
	        dev:{ enabled: true, level: 'debug' }
	    },
	    cookies: {
	        prod: { appCookie: { description: 'Application Cookie', secret: 'some_secret', lifetime: '{{ constants.monthInMs }}' } },
	        test: { appCookie: { secret: 'some_other_secret' } }
	    }
	};
	
	module.exports = behaviors;


These behaviors must follow your behavior tags in the environments file.

### Define your dependencies

Create a dependencies directory and dependency file for each dependency (`examples/complex/config/dependencies/mongoAccount.js`). Here is a JS version (note, you could put these in one file, but many cleans it up):

	
	var dependency = {
	    production: { host: 'mongohq.com', port: 18000, database: 'prod_db',  username: 'user', password: { __envVar: 'MONGODB_PASSWORD' } },
	    stage:      { host: 'mongohq.com', port: 18000, database: 'stage_db' },
	    development:{ host: 'mongohq.com', port: 18000, database: 'dev_db',  username: 'foo', password: 'bar' },
	    local:      { host: 'localhost',   port: 17001, database: 'dev_db',  __doExtendFromParent: true }
	};
	
	module.exports = dependency;


These dependencies must follow your dependency tags in the environments file.

### OUTPUTS

Here you get to reference all of your inputs, after the proper environment has been created. Although you certainly don't need to create outputs, if you want to modularize your config, this can be helpful. It is also a good place to put common configuration utilities (like generating mongodb urls from server/account names).

#### Define your modules

Like dependencies, it is often cleaner to put these in a directory. Here is the accountService example (`examples/complex/config/dependencies/accountService.js`:

	'use strict';
	var Joi = require('joi');
	
	var mod = {
	    mongo: {
	        host:       { __tmpl: '##:dependencies.mongoAccounts.host',      __schema: Joi.string() },
	        port:       { __tmpl: '##:dependencies.mongoAccounts.port',      __schema: Joi.number().min(1).max(65535) },
	        database:   { __tmpl: '##:dependencies.mongoAccounts.database',  __schema: Joi.string() },
	        username:   { __tmpl: '##:dependencies.mongoAccounts.username',  __schema: Joi.string().optional() },
	        password:   { __tmpl: '##:dependencies.mongoAccounts.password',  __schema: Joi.string().optional() }
	    },
	    mongoUrl: function(){
	        var usernamePassword = this.mongo.username ? this.mongo.username + ':' + this.mongo.password  + '@': '';
	        return 'mongodb://' + usernamePassword + this.mongo.host + ':' + this.mongo.port + '/' + this.mongo.database;
	    }
	    //mongoUrl: { __tmpl: 'http://<%= dependencies.server.host %>:<%= dependencies.server.port %>', schema: Joi.string() },
	};
	
	module.exports = mod;


#### Module notes

Modules are small config units that can be passed to a code module. For instance, an accountService probably doesn't need to know how long to cache an html page, so it shouldn't be part of the config to the accountService. Modules are just small config abstractions:

- Although you can put in validation anywhere, this is ultimately what would be used by your code, so configuration is best placed here.
- Note how the dependency input is labeled mongo account (or server), but the output is account service. Module names should relate to the module they are configuring. The accountService might also include oauth config, or other constants, dependencies, or behaviors.
- TODO: Clean this up to show better aggregation and abstraction around modules.



