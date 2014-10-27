'use strict';

//var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var envBuilder = require('../lib/envBuilder');
var log = require('../lib/log');
log.setDebug(false);


chai.config.includeStack = true; // turn on stack trace

var validTagConfig = [
    {name: 'prod'},
    {name: 'test', parent: 'prod'},
    {name: 'dev', parent: 'test'},
    {name: 'silly', parent: 'prod'}
];

var invalidTagConfig = [
    {name: 'prod'},
    {name: 'test', parent: 'prod'},
    {name: 'dev', parent: 'test'},
    {name: 'silly', parent: 'foo'}
];

var dependencyTagsConfig = [
    {name:'production'},
    {name:'stage', parent: 'production'},
    {name:'development', parent: 'stage'},
    {name:'local', parent: 'development'},
    {name:'localTest', parent: 'local'}
];

var behaviorTagsConfig = [
    {name:'prod'},
    {name:'test', parent: 'prod'},
    {name:'dev', parent: 'test'}
];

var environmentsConfig = {
    'production':   { behavior: 'prod', dependency: 'production' },
    'stage':        { behavior: 'prod', dependency: 'stage' },
    'development':  { behavior: 'dev',  dependency: 'development' },
    'local.dev':    { behavior: 'dev',  dependency: 'local' },
    'local.test':   { behavior: 'test', dependency: 'localTest' }
};

var environments = {
    environments: environmentsConfig,
    dependencyTags:  dependencyTagsConfig,
    behaviorTags: behaviorTagsConfig
};



describe('joifulConfig:', function () {

    describe('envBuilder', function () {

        describe('createTags', function () {

            describe('properly configured tags', function () {
                var createdTags;

                beforeEach(function (done) {
                    createdTags = envBuilder.createTags(validTagConfig);
                    //log.dumpObject('tags', createdTags);
                    done();
                });

                it('should create prod tag with no parent', function (done) {
                    expect(createdTags.prod.name).to.be.eql('prod');
                    expect(createdTags.prod.parent).to.be.undefined;
                    done();
                });

                it('should create test tag with prod parent', function (done) {
                    expect(createdTags.test.name).to.be.eql('test');
                    expect(createdTags.test.parent).to.be.eql('prod');
                    done();
                });

                it('should create dev tag with test parent', function (done) {
                    expect(createdTags.dev.name).to.be.eql('dev');
                    expect(createdTags.dev.parent).to.be.eql('test');
                    done();
                });

                it('should create silly tag with prod parent', function (done) {
                    expect(createdTags.silly.name).to.be.eql('silly');
                    expect(createdTags.silly.parent).to.be.eql('prod');
                    done();
                });
            });

            describe('invalid configuration', function () {

                it('should throw if invalid parent', function (done) {

                    expect(function(){
                        envBuilder.createTags(invalidTagConfig);
                    }).to.throw(Error, 'Invalid Tag [silly] has non existent parent: foo');

                    done();
                });
            });

        });

        //describe('createEnvironments');
        //describe('buildEnvironments');
        //describe('validate');

        describe('buildEnvironments', function () {

            describe('properly configured tags', function () {
                var createdEnvironments;

                before(function (done) {
                    createdEnvironments = envBuilder.buildEnvironments(environments);
                    log.dumpObject('createdEnvironments', createdEnvironments);
                    done();
                });


                it('should create proper behaviorTags', function (done) {
                    expect(createdEnvironments.behaviorTags.prod.name).to.be.eql('prod');
                    expect(createdEnvironments.behaviorTags.prod.parent).to.be.undefined;

                    expect(createdEnvironments.behaviorTags.test.name).to.be.eql('test');
                    expect(createdEnvironments.behaviorTags.test.parent).to.be.eql('prod');

                    expect(createdEnvironments.behaviorTags.dev.name).to.be.eql('dev');
                    expect(createdEnvironments.behaviorTags.dev.parent).to.be.eql('test');

                    done();
                });

                it('should create proper dependencyTags', function (done) {
                    expect(createdEnvironments.dependencyTags.production.name).to.be.eql('production');
                    expect(createdEnvironments.dependencyTags.production.parent).to.be.undefined;

                    expect(createdEnvironments.dependencyTags.stage.name).to.be.eql('stage');
                    expect(createdEnvironments.dependencyTags.stage.parent).to.be.eql('production');

                    expect(createdEnvironments.dependencyTags.development.name).to.be.eql('development');
                    expect(createdEnvironments.dependencyTags.development.parent).to.be.eql('stage');

                    expect(createdEnvironments.dependencyTags.local.name).to.be.eql('local');
                    expect(createdEnvironments.dependencyTags.local.parent).to.be.eql('development');

                    expect(createdEnvironments.dependencyTags.localTest.name).to.be.eql('localTest');
                    expect(createdEnvironments.dependencyTags.localTest.parent).to.be.eql('local');

                    done();
                });


                it('should create proper environments', function (done) {
                    expect(createdEnvironments.environments.production.name).to.be.eql('production');
                    expect(createdEnvironments.environments.production.dependencyTag).to.be.eql('production');
                    expect(createdEnvironments.environments.production.behaviorTag).to.be.eql('prod');

                    expect(createdEnvironments.environments.stage.name).to.be.eql('stage');
                    expect(createdEnvironments.environments.stage.dependencyTag).to.be.eql('stage');
                    expect(createdEnvironments.environments.stage.behaviorTag).to.be.eql('prod');

                    expect(createdEnvironments.environments.development.name).to.be.eql('development');
                    expect(createdEnvironments.environments.development.dependencyTag).to.be.eql('development');
                    expect(createdEnvironments.environments.development.behaviorTag).to.be.eql('dev');

                    expect(createdEnvironments.environments['local.dev'].name).to.be.eql('local.dev');
                    expect(createdEnvironments.environments['local.dev'].dependencyTag).to.be.eql('local');
                    expect(createdEnvironments.environments['local.dev'].behaviorTag).to.be.eql('dev');

                    expect(createdEnvironments.environments['local.test'].name).to.be.eql('local.test');
                    expect(createdEnvironments.environments['local.test'].dependencyTag).to.be.eql('localTest');
                    expect(createdEnvironments.environments['local.test'].behaviorTag).to.be.eql('test');


                    done();
                });

            });

            describe('invalid configuration', function () {

                it('should throw if invalid parent', function (done) {
                    var badEnvConfig = _.cloneDeep(environments);
                    badEnvConfig.dependencyTags[badEnvConfig.dependencyTags.length-1].parent = 'badParent';
                    expect(function(){
                        envBuilder.buildEnvironments(badEnvConfig);
                    }).to.throw(Error, 'Invalid Tag [localTest] has non existent parent: badParent');

                    done();
                });
            });

        });

    });


});