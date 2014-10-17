'use strict';

//var path = require('path');
var Joi = require('joi');
var chai = require('chai');
var expect = chai.expect;
var processObject = require('../lib/processObject');


chai.config.includeStack = true; // turn on stack trace

describe('joifulConfig:', function () {

    describe('processObject', function () {

        describe('number values', function () {
            it('should render string values through template engine and resolve correctly', function (done) {
                var objToProcess = {
                    gandalf: { age: 150, ageTempl: '{{ gandalf.age }}',ageDot: '##:gandalf.age' }
                };

                processObject(objToProcess);
                expect(objToProcess.gandalf.age).to.be.eql(150);
                expect(objToProcess.gandalf.ageTempl).to.be.eql('150');
                expect(objToProcess.gandalf.ageDot).to.be.eql(150);
                done();
            });
        });

        describe('array values', function () {
            it('should render string values through template engine and resolve correctly', function (done) {
                var objToProcess = {
                    gandalf: {
                        friends: ['bilbo', 'frodo'],
                        friendsTempl: '{{ gandalf.friends }}',
                        friendsDot: '##:gandalf.friends'
                    }
                };

                processObject(objToProcess);
                expect(objToProcess.gandalf.friends).to.be.eql(['bilbo', 'frodo']);
                expect(objToProcess.gandalf.friendsDot).to.be.eql(['bilbo', 'frodo']);

                // note the difference in the template
                expect(objToProcess.gandalf.friendsTempl).to.be.eql('bilbo,frodo');

                done();
            });
        });

        describe('obj values in dot notation', function () {
            it('should render correct object from string value', function (done) {
                var objToProcess = {
                    gandalf: {
                        bag: { fireworks: true },
                        bagDot: '##:gandalf.bag'
                    }
                };
                processObject(objToProcess);
                expect(objToProcess.gandalf.bag).to.be.eql({ fireworks: true });
                expect(objToProcess.gandalf.bagDot).to.be.eql({ fireworks: true });
                done();
            });

            it('should render correct object from meta tmpl', function (done) {
                var objToProcess = {
                    gandalf: {
                        bag: { fireworks: true },
                        bagDot: {__tmpl: '##:gandalf.bag' }
                    }
                };
                processObject(objToProcess);
                expect(objToProcess.gandalf.bag).to.be.eql({ fireworks: true });
                expect(objToProcess.gandalf.bagDot).to.be.eql({ fireworks: true });
                done();
            });
        });

        describe('obj values in template', function () {

            it('should throw an error when rendering an object from string', function (done) {
                var objToProcess = {
                    gandalf: {
                        bag: { fireworks: true },
                        bagTempl: '{{ gandalf.bag }}'
                    }
                };
                expect(function(){processObject(objToProcess);}).to.throw(Error, 'Looks like you are trying to render an object in your template!');
                done();
            });

            it('should throw an error when rendering an object from meta', function (done) {
                var objToProcess = {
                    gandalf: {
                        bag: { fireworks: true },
                        bagTempl: { __tmpl: '{{ gandalf.bag }}'}
                    }
                };
                expect(function(){processObject(objToProcess);}).to.throw(Error, 'Looks like you are trying to render an object in your template!');
                done();
            });
        });


        describe('function values work', function () {

            it('should render object methods correctly', function (done) {

                var objToProcess = {
                    hobbits: {
                        bilbo: true
                    },
                    bilbo: {
                        isHobbit: '##:hobbits.bilbo',
                        hasHairyFeet: function(){
                            return this.isHobbit;
                        }
                    }
                };

                expect(objToProcess.hobbits.bilbo).to.be.true;
                processObject(objToProcess);
                expect(objToProcess.hobbits.bilbo).to.be.true;
                expect(objToProcess.bilbo.isHobbit).to.be.true;
                expect(objToProcess.bilbo.hasHairyFeet()).to.be.true;
                done();
            });

        });
        describe('environment variables work', function () {

            it('should get the correct value', function (done) {

                var envVar = 'hobbits.bilbo';
                process.env[envVar] = 'yup';
                var objToProcess = {
                    bilbo: {
                        isHobbit: {__envVar: envVar }
                    }
                };

                processObject(objToProcess);
                expect(objToProcess.bilbo.isHobbit).to.be.eql('yup');
                done();
            });

            it('should throw if variable doesnt exist the correct value', function (done) {

                var envVar = 'hobbits.bilbo.bags';
                var objToProcess = {
                    bilbo: {
                        isHobbit: {__envVar: envVar }
                    }
                };

                expect(function(){processObject(objToProcess);}).to.throw(Error);
                done();
            });

        });

        describe('schema validation works', function () {

            it('should succeed when a boolean is returned', function (done) {

                var objToProcess = {
                    hobbits: {
                        bilbo: false
                    },
                    bilbo: {
                        isHobbit: { __tmpl: '##:hobbits.bilbo', __schema: Joi.boolean() }
                    }
                };

                expect(objToProcess.hobbits.bilbo).to.be.false;
                processObject(objToProcess);
                expect(objToProcess.hobbits.bilbo).to.be.false;
                expect(objToProcess.bilbo.isHobbit).to.be.false;
                done();
            });

            it('should throw when a string is returned instead of a bool', function (done) {

                var objToProcess = {
                    hobbits: {
                        bilbo: 'bill'
                    },
                    bilbo: {
                        isHobbit: { __tmpl: '##:hobbits.bilbo', __schema: Joi.boolean() }
                    }
                };

                expect(objToProcess.hobbits.bilbo).to.be.eql('bill');
                expect(function(){processObject(objToProcess);}).to.throw(Error, 'value must be a boolean');
                done();
            });

            it('should be ok with truth values', function (done) {

                var objToProcess = {
                    hobbits: {
                        bilbo: true
                    },
                    bilbo: {
                        isHobbit: { __tmpl: '{{hobbits.bilbo}}', __schema: Joi.boolean() }
                    }
                };

                expect(objToProcess.hobbits.bilbo).to.be.eql(true);
                processObject(objToProcess);
                expect(objToProcess.bilbo.isHobbit).to.not.be.true;
                expect(objToProcess.bilbo.isHobbit).to.be.eql('true');
                done();
            });

        });

    });


});