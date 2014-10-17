var joifulConfig = require('../../../lib/index');
var envBuilders = joifulConfig.envBuilder;

//
// Use the environment builder to define:
// 1. Dependency Tags (these have to do with the location of the dependencies (servernames/creds))
// 2. Settings Tags (this has to do with the way the code should work (logging/timeouts)
// 3. Environments => this is a combination of dependencies and settings, using inheritance
//

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

module.exports = {
    environments: environments,
    dependencyTags: dependencyTags,
    settingsTags: settingsTags
};