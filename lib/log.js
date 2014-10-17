'use strict';

// borrowed from https://github.com/epeli/underscore.string/blob/master/lib/underscore.string.js;
var pad = require('./pad');

var logConsole = false;
var setDebug = function(debug){
    logConsole = debug;
};

var log = function(){
    if(logConsole){
        console.log.apply(console.log, arguments);
    }
};


var dumpSectionStart = function (name) {
    log('\n\n\n');
    log('================================================================================');
    log('==' + pad.lrpad('SECTION.START:' + name, 76) + '==');
    var args = Array.prototype.slice.call(arguments, 1);
    args.forEach(function(arg){
        log('==   ' + pad.lpad('Arg: ' + arg, 70) + '   ==');
    });
    log('================================================================================');
};
var dumpSectionEnd = function (name) {
    log('================================================================================');
    log('==' + pad.lrpad('SECTION.END:' + name, 76) + '==');
    log('================================================================================');
    log('\n\n\n');
};

var dumpSubSectionStart = function (name) {
    log('\n\n');
    log(' --------------------------------------------------------------------------------');
    log(' -----' + pad.lrpad( 'SS.START:' + name, 70) + '-----');
    log(' --------------------------------------------------------------------------------');
};

var dumpSubSectionEnd = function (name) {
    log(' --------------------------------------------------------------------------------');
    log(' -----' + pad.lrpad( 'SS.END:' + name, 70) + '-----');
    log(' --------------------------------------------------------------------------------');
    log('\n\n');
};

var dumpObject = function (name, obj) {
    log('\n\n');
    log(' --------------------------------------------------------------------------------');
    log(' -----' + pad.lrpad('Dumping: ' + name, 70) + '-----');
    log(' --------------------------------------------------------------------------------');
    log(JSON.stringify(obj, undefined, 4));
    log(' --------------------------------------------------------------------------------');
};

log.setDebug = setDebug;
log.dumpObject = dumpObject;
log.dumpSubSectionStart = dumpSubSectionStart;
log.dumpSubSectionEnd = dumpSubSectionEnd;
log.dumpSectionStart = dumpSectionStart;
log.dumpSectionEnd = dumpSectionEnd;

module.exports = log;
