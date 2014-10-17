'use strict';

var assert = require('assert');
var Joi = require('joi');
var _ = require('lodash');
var nunjucks = require('nunjucks');

var log = require('./log');

var processObject = function(objToProcess, objToResolve){

    objToResolve = objToResolve || objToProcess;

    var DOT_PREFIX = '##:';

    var getEnvVar = function(envVar){
        var val = process.env[envVar];
        if (!val) {
            var error = '*** Missing environment variable: ' + envVar + ' ***\n----------> PLEASE SET process.env.' + envVar + ' <----------';
            console.error(error);
            throw new Error(error);
        }
        return val;
    };

    var isDotNotation = function(value){
        return value.trim().indexOf(DOT_PREFIX) === 0;
    };

    var fetchProperty = function(property){
        var splitProp = property.split('.');
        var subObjToResolve = objToResolve;
        splitProp.forEach(function(subProp){
            subObjToResolve = subObjToResolve[subProp];
            if(!subObjToResolve){
                log('missing property in config:', property);
                return;
            }
        });
        return subObjToResolve;
    };

    var processAsDotNotation = function(stringValue){
        var dotSplit = stringValue.trim().split(DOT_PREFIX);
        assert(dotSplit.length === 2, 'invalid dotnotation value: ', stringValue);
        var dots = dotSplit[1];
        return fetchProperty(dots);
    };

    var processAsTemplate = function(stringValue){
        console.log('processAsTemplate:',stringValue);
        var ret = nunjucks.renderString(stringValue, objToResolve);
        if(ret.indexOf('[object Object]') >= 0){
            throw new Error('Looks like you are trying to render an object in your template!');
        }
        return ret;
    };

    var processStringValue = function(stringValue){
        if(isDotNotation(stringValue)){
            return processAsDotNotation(stringValue);
        }
        return processAsTemplate(stringValue);
    };

    var validateSchema = function(schema, processedValue){
        console.log('validating schema:', processedValue);
        var result = Joi.validate(processedValue, schema);
        console.log('validating result:', result);
        if(result.error) {
            console.trace('Validation Error: ');
            console.error('- value: \n', JSON.stringify(processedValue, undefined, 4));
            console.error('- Exception: \n', result.error);
            throw result.error;
        }
        return result.value;
    };

    var processValidMetaObjectValue = function(value, key, obj){
        var processedValue;
        if(value.__envVar){
            processedValue = getEnvVar(value.__envVar);
        }
        else if(value.__tmpl){
            processedValue = processStringValue(value.__tmpl);
        }
        else if(value.__val){
            processedValue = value.__val;
        }
        else {
            throw new Error('Should have hit one of those!');
        }

        if(value.__schema){
            validateSchema(value.__schema, processedValue);
        }

        obj[key] = processedValue;
    };

    var validateMetaObject = function(value){
        // todo: ensure that there are no other props on here.
        if ( value.__val ) {
            assert(value.__tmpl === undefined, 'You may not have a __tmpl with a __val');
            assert(value.__envVar === undefined, 'You may not have a __envVar with a __val');
            if(!value.__schema){
                console.log('You should move your .__val into its own object: ', value);
            }
        }
        else if ( value.__tmpl ) {
            assert(value.__envVar === undefined, 'You may not have a __envVar with a __tmpl');
            if(!value.__schema){
                console.log('You should move your .__tmpl into its own object: ', value);
            }
        }
        else if ( value.__envVar ) {
            assert(value.__tmpl === undefined, 'You may not have a __envVar with a __tmpl');
        }
        else {
            assert(value.__schema !== undefined, 'You may not have a __schema without a __val or __tmpl');
        }
        return true;
    };

    var isMetaObject = function(value){
        if ( value && (value.__tmpl || value.__val || value.__schema || value.__envVar)) {
            validateMetaObject(value);
            return true;
        }
        return false;
    };

    var processObjectRecursive = function(obj){
        _.forEach(obj, function (value, key, o) {
            if (_.isString(value)) {
                o[key] = processStringValue(value);
            }
            else if (isMetaObject(value)) {
                processValidMetaObjectValue(value, key, o);
            }
            else if (_.isObject(value)) {
                return processObjectRecursive(value);
            }
        });
    };

    processObjectRecursive(objToProcess);
};



module.exports = processObject;