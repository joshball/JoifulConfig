var joifulConfig = require('../../../lib/index');
var envBuilder = joifulConfig.envBuilder;

//
// Use the environment builder to define:
// 1. Dependency Tags (these have to do with the location of the dependencies (servernames/creds))
// 2. Settings Tags (this has to do with the way the code should work (logging/timeouts)
// 3. Environments => this is a combination of dependencies and behaviors, using inheritance
//

var dependencyTags = envBuilder.createTags([
    {name:'production'},
    {name:'stage', parent: 'production'},
    {name:'development', parent: 'stage'},
    {name:'local', parent: 'development'},
    {name:'localTest', parent: 'local'}
]);

var behaviorTags = envBuilder.createTags([
    {name:'prod'},
    {name:'test', parent: 'prod'},
    {name:'dev', parent: 'test'}
]);

var environments = envBuilder.createEnvironments({
    'production':   { behaviors: 'prod', dep: 'production' },
    'stage':        { behaviors: 'prod', dep: 'stage' },
    'development':  { behaviors: 'dev',  dep: 'development' },
    'local.dev':    { behaviors: 'dev',  dep: 'local' },
    'local.test':   { behaviors: 'test', dep: 'localTest' }
});

envBuilder.validate(environments, dependencyTags, behaviorTags);

module.exports = {
    environments: environments,
    dependencyTags: dependencyTags,
    behaviorTags: behaviorTags
};