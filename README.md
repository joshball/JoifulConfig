# JoifulConfig

Configuration using nunjucks templating, Joi validations, and separation of physical from logical environments

## Overview

Configuration in projects with lots of environments and dependencies can be complex, and wasting time tracking down errors in your configuration is especially frustrating. 

JoifulConfig approaches configuration by:
 
- separating physical environments from settings environments
- abstracting out constants (which are shared, but don't change) 
- mixes in some templates
- throws in a little Joi validation
- abstract configuration consumption into modules

JoifulConfig is NOT meant for simple examples. It has some overhead to it, so use one of the other awesome config libraries for simpler configuration.

## Concepts and Definitions

We need to define and redefine a few terms. The biggest overload is the term environment. What exactly is an environment? It seems to me it is both physical and contextual. For instance, man shops have an application that runs in four or more physical environments:
- local dev box
- shared development environment (for the team)
- integration environment (for integrating with other teams)
- staging environment (for final QA before releasing)
- production environment (where the application is publicly available)

However, each of those physical environments might have the application configured in different ways. Your external dependencies change (your DB in production should be different than in dev). Your settings for the app change as well (logging levels). And those can vary independently. For instance, you might run the production settings on your local dev box.

So, we use the following terminology (I am not sold on these terms, so feel free to suggest others, but I needed something...)

- tag - way to identify a set of settings or dependencies
- constants - things that should be abstracted, and therefore shared, but wont change per environment (path to assets, for example)
- settings - things that change how the application works, and change depending upon the environment (logging)
    - the settings environment is what we typically think of as production (prod), test, and development (dev)
- dependencies - servers/services that change depending upon the physical environment (database servers and keys).
    - the physical environment, although often labeled the same, can be orthoganol to the settings environment (production settings running on localhost)
- environment - tuple of settings tags and dependency tags


## Examples

There are two examples in the repo:
- examples/simple
- examples/complex


## Understanding a complex example

### Setup your configuration directory

Create the following files
	./config
	./config/environments.js
	./config/constants.js
	./config/settings.js
	./config/modules/
	./config/dependencies/


### Environments: ./config/environments.js

Environments are defined as a tuple of dependency tags and settings tags.

Think of settings tags as your traditional environment (prod/test/dev). And your dependency tags as physical environments that you run in (production, stage, qa, integration, development, local). Each tag also has a parent

From there you can create an environment from the tuple. Here is the example

```
var dependencyTags = envBuilders.createTags([
    {name:'production'},
    {name:'stage', parent: 'production'},
    {name:'development', parent: 'stage'},
    {name:'local', parent: 'development'},
    {name:'localTest', parent: 'local'}
]);

var settingsTags = envBuilders.createTags([
    {name:'prod'},
    {name:'test', parent: 'prod'},
    {name:'dev', parent: 'test'}
]);

var environments = envBuilders.createEnvironments({
    'production':   { settings: 'prod', dep: 'production' },
    'stage':        { settings: 'prod', dep: 'stage' },
    'development':  { settings: 'dev',  dep: 'development' },
    'local.dev':    { settings: 'dev',  dep: 'local' },
    'local.test':   { settings: 'test', dep: 'localTest' }
});

envBuilders.validate(environments, dependencyTags, settingsTags);
```

### Constants: ./config/constants.js

Part of config is simple abstractions. Things like url route prefixes or paths on disk (for assets) that are shared through the config, but don't change by the environment. You can stick those here.

```
var constants ={
    assets: {
        paths:{
            root: '/assets',
            scripts: '<%= constants.assets.paths.root %>/scripts',
            styles: '<%= constants.assets.paths.root %>/styles',
            images: '<%= constants.assets.paths.root %>/images',
            vendor: '<%= constants.assets.paths.root %>/vendor'
        }
    },
    api:{
        rootPath: '/api'
    }
};

module.exports = constants;
``` 

### Settings: ./config/settings.js

Settings affect how the program runs. They likely change depending upon the context of the application. In dev, we might want all logging. In test, maybe none (keeping output clean), in prod we want just warnings and errors. 

```
var settings ={
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
        prod: { appCookie: { description: 'Application Cookie', secret: 'some_secret', lifetime: '<%= constants.monthInMs %>' } },
        test: { appCookie: { secret: 'some_other_secret' } }
    }
};

module.exports = settings;

```

Note, settings are in one file now. I find that these don't grow too large, so it seemed to work for me. No reason why we couldn't check for a directory structure, just haven't implemented that.

### Dependencies: ./config/dependencies/*.dep.js

Dependencies are created based upon physical environments/locations. Here are some examples:

```
./config/dependencies/server.dep.js
var dependency =  {
    production: { host: 'example.com', port: 80 },
    stage: { host: 'stage.heroku.com', port: 80 },
    development: { host: 'dev.heroku.com', port: 80 },
    local: { host: 'localhost', port: 9999 }
};

module.exports = dependency;
```

```
./config/dependencies/firebaseCore.dep.js
var dependency = {
    production: { host: 'prod.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } },
    development: { host: 'dev.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } },
    localTest: { host: 'test.firebase.io', account: 'accountName',  token: { __envVar: 'FIREBASE_TOKEN' } }
};

module.exports = dependency;
```

### Modules: ./config/modules/*.mod.js

Modules are the final goal. You could begin using the config file as described. For instance, at this point, you have the following:
```
var config = joifulConfig('local-dev');

assert.true(config.settings.logging.enabled === true)
assert.true(config.dependency.server.host === 'localhost')
assert.true(config.dependency.firebaseCore.host === 'dev.firebase.io')

```
However, I find configuring a module, I like to only include what is needed. For instance, if configuring the db service module, I don't need to know the logging level (hopefully I have injected a logger that is already setup), and I don't care what port the server is, instead I want to know about my mongo connection. So I might write a module (and a nice way to create a mongodb url):

```
'use strict';
var Joi = require('joi');

var mod = {
    mongo: {
        host:       { tmpl: 'dependencies.mongoAccounts.host',      schema: Joi.string() },
        port:       { tmpl: 'dependencies.mongoAccounts.port',      schema: Joi.number().min(1).max(65535) },
        database:   { tmpl: 'dependencies.mongoAccounts.database',  schema: Joi.string() },
        username:   { tmpl: 'dependencies.mongoAccounts.username',  schema: Joi.string().optional() },
        password:   { tmpl: 'dependencies.mongoAccounts.password',  schema: Joi.string().optional() }
    },
    mongoUrl: function(){
        var usernamePassword = this.mongo.username ? this.mongo.username + ':' + this.mongo.password  + '@': '';
        return 'mongodb://' + usernamePassword + this.mongo.host + ':' + this.mongo.port + '/' + this.mongo.database;
    }
    //mongoUrl: { tmpl: 'http://<%= dependencies.server.host %>:<%= dependencies.server.port %>', schema: Joi.string() },
};

module.exports = mod;

``` 

Now, instead of having my db service be passed a config where it would have to fetch all the different settings, I just pass it `config.accountService` and it can call `.mongoUrl()` and thats it.

That's configuration, in a nutshell.

### Details

The configuration files are just objects. The values of the objects can be anything, and if the values aren't 'special objects', then they are passed through. For instance, looking at the constants again:

```
var constants ={
    assets: {
        paths:{
            root: '/assets',
            scripts: '<%= constants.assets.paths.root %>/scripts',
            styles: '<%= constants.assets.paths.root %>/styles',
            images: '<%= constants.assets.paths.root %>/images',
            vendor: '<%= constants.assets.paths.root %>/vendor'
        }
    },
    api:{
        rootPath: '/api'
    }
};
``` 
We can see that after calling joifulConfig, you have access to:

```
var config = joifulConfig('local-dev');
assert.true(config.constants.assets.paths.root === '/assets')
assert.true(config.constants.assets.paths.scripts === '/assets/scripts')
```

Any string value will be run through the (lodash) templating function. (In fact, it will be run through their multiple times in case a dependency wasn't resolved the first time).

That works fine for the simple cases in constants, however, there are several extensions we could use to get more robust behavior. They are:
- `__envVar:'string'` - interpret string as an environment variable (and fetch and replace it)
- `__tmpl:'string'` - interpret string as an environment variable (and fetch and replace it)

What if the string in the template is an object. For instance:
```
var constants ={
    assets: {
        paths:{
        }
    },
    badExample: '<%= constants.assets %>', // this isn't JSON :-(
    reallyBadExample: 'Hello <%= constants.assets %>' // Not even sure what this should be!
};
```

So, both of these substitute `[object Object]` for the result. Which is not what you want. So to let you know, we throw if any of your strings end up with `[object Object]`. You can turn that off with options, if you choose.

So, how do you access another object? Using `__tmpl`, and dot notation (not template notation):
```
var constants ={
    assets: {
        paths:{
        }
    },
    thisWorks: { __tmpl: 'constants.assets', // this sets 'thisWorks': { paths: {} }
    thisWouldNotWork: { __tmpl: '<%= constants.assets', // this would still not work
};
```
You can still use template syntax, but it just outputs strings.

Here is the algorithm:
```
foreach key,value in object (recursively)
if value === string
	value = processString(value)
	return;
if value.__envVar
	if(value.__val) throw Error
	value.__val = extractEnvVar(value.__envVar)
if value.__tmpl
	if(value.__val) throw Error
	value.__val = processString(value.__tmpl)
if value.__schema
	if(!value.__val) throw Error
	validateSchema(value.__schema, value.__val) // throw if invalid
ASSERT value.__val // all processing should result in a __val!
	value = value.__val
	return;

processString:
	- if string starts with '##:'
		- processDotNotation
	- else
		- processTemplate

processDotNotation:
	- split the string on _DOT_: Take second part
	- apply that as dot notation reference to object
		- ##:foo.bar (on object { foo: { bar: BAZ } } ) returns BAZ
		- returns the raw value, not as string.  

processTemplate:
	runs the string through the template engine


```

