'use strict';

var mod = {
    podio: {
        auth:       { __tmpl: '##:dependencies.podio.auth' },
        surveyApp:  { __tmpl: '##:dependencies.podio.apps.SomeSurvey'}
    }
};

module.exports = mod;