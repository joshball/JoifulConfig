'use strict';

//var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var flush = require('../lib/flush');
var log = require('../lib/log');
//utils.setDebug(true);


var environments = require('./fixtures/environments');
var dependencies = require('./fixtures/dependencies');
var TAGS = environments.tags;
var TAG = environments.tag;
var DEP = dependencies;

chai.config.includeStack = true; // turn on stack trace


describe('joifulConfig:', function () {

    describe('flush', function () {

        describe('all', function () {

            it('should have all environments set to prod', function (done) {

                var config = {
                    server: {
                        prod: DEP.server.prod
                    }
                };

                var flushedConfig = flush.all(TAGS, config);

                log('expecting each environment (%s) to mimic prod:', TAGS.join(','));
                TAGS.forEach(function(env){
                    log('\n checking %s', env);
                    var actualEnv = flushedConfig.server[env];
                    var expectedEnv = DEP.server.prod;
                    log(' -  extendedConfig.server[%s].host: %s == %s', env, actualEnv.host, expectedEnv.host);
                    expect(actualEnv.host).to.be.eql(expectedEnv.host);
                    log(' -  extendedConfig.server[%s].port: %s == %s', env, actualEnv.port, expectedEnv.port);
                    expect(actualEnv.port).to.be.eql(expectedEnv.port);
                });
                done();
            });

            it('should override child tags properly', function (done) {
                var config = {
                    server: DEP.server
                };

                var flushedConfig = flush.all(TAGS, config);
                log('expecting each environment (%s) to be correct:', TAGS.join(','));
                TAGS.forEach(function(env){
                    log('\n checking %s', env);
                    var actualEnv = flushedConfig.server[env];
                    var expectedEnv = DEP.server[env];
                    log(' -  extendedConfig.server[%s].host: %s == %s', env, actualEnv.host, expectedEnv.host);
                    expect(actualEnv.host).to.be.eql(expectedEnv.host);
                    log(' -  extendedConfig.server[%s].port: %s == %s', env, actualEnv.port, expectedEnv.port);
                    expect(actualEnv.port).to.be.eql(expectedEnv.port);
                });

                done();
            });


            it('should ignore bad tags', function (done) {
                var config = {
                    server: DEP.server
                };
                var flushedConfig = flush.all(TAGS, config);
                log('expecting badTag to be undefined:');
                expect(flushedConfig.server.badTag).to.be.undefined;
                done();
            });


            it('should not have child tags on parent', function (done) {
                var config = {
                    server: DEP.server
                };

                var flushedConfig = flush.all(TAGS, config);

                log('expecting prod to not have test/dev extras:');
                var prodConfig = flushedConfig.server.prod;
                expect(prodConfig.testExtra).to.be.undefined;
                expect(prodConfig.devExtra).to.be.undefined;

                done();
            });




            it('should correctly set tag if not from parent', function (done) {
                var config = {
                    server: DEP.server
                };

                var flushedConfig = flush.all(TAGS, config);


                log('expecting test to not have dev extras:');
                var testConfig = flushedConfig.server.test;
                expect(testConfig.testExtra.name).to.be.eql('testExtra');
                expect(testConfig.testExtra.num).to.be.eql(2);
                expect(testConfig.devExtra).to.be.undefined;

                done();
            });




            it('should override parent tag if set', function (done) {
                var config = {
                    server: DEP.server
                };

                var flushedConfig = flush.all(TAGS, config);

                var devConfig = flushedConfig.server.dev;
                log('expecting dev to overide testExtra:');
                expect(devConfig.testExtra.name).to.be.eql('testExtra');
                expect(devConfig.testExtra.num).to.be.eql(4);

                log('expecting dev to have dev extras:');
                expect(devConfig.devExtra.name).to.be.eql('devExtra');
                expect(devConfig.devExtra.num).to.be.eql(3);

                done();
            });


        });

        describe('tag', function () {

            it('should have only prod behaviors', function (done) {

                var config = {
                    server: DEP.server
                };

                var prod = DEP.server.prod;
                var flushedConfig = flush.tag(TAGS, TAG.prod, config);
                log('expecting environment to be prod:');

                var actualEnv = flushedConfig.server;
                var expectedEnv = DEP.server[TAG.prod];
                log(' -  extendedConfig.server[%s].host: %s == %s', prod, actualEnv.host, expectedEnv.host);
                expect(actualEnv.host).to.be.eql(expectedEnv.host);
                log(' -  extendedConfig.server[%s].port: %s == %s', prod, actualEnv.port, expectedEnv.port);
                expect(actualEnv.port).to.be.eql(expectedEnv.port);

                done();
            });

            it('should have only test behaviors', function (done) {

                var config = {
                    server: DEP.server
                };

                var flushedConfig = flush.tag(TAGS, TAG.test, config);
                var actualEnv = flushedConfig.server;
                var expectedEnv = DEP.server[TAG.test];

                expect(actualEnv.host).to.be.eql(expectedEnv.host);
                expect(actualEnv.port).to.be.eql(expectedEnv.port);

                expect(actualEnv.testExtra.name).to.be.eql('testExtra');
                expect(actualEnv.testExtra.num).to.be.eql(2);
                expect(actualEnv.devExtra).to.be.undefined;

                done();
            });

            it('should have only dev behaviors', function (done) {

                var config = {
                    server: DEP.server
                };
                var flushedConfig = flush.tag(TAGS, TAG.dev, config);
                var actualEnv = flushedConfig.server;
                var expectedEnv = DEP.server[TAG.dev];

                expect(actualEnv.host).to.be.eql(expectedEnv.host);
                expect(actualEnv.port).to.be.eql(expectedEnv.port);

                expect(actualEnv.testExtra.name).to.be.eql('testExtra');
                expect(actualEnv.testExtra.num).to.be.eql(4);

                expect(actualEnv.devExtra.name).to.be.eql('devExtra');
                expect(actualEnv.devExtra.num).to.be.eql(3);

                done();
            });

            it('should throw if invalid tag', function (done) {

                var config = {
                    server: DEP.server
                };

                var flushBadTag = function () { flush.tag(TAGS, 'badTag', config); };
                expect(flushBadTag).to.throw(Error);

                done();
            });

        });

    });


});