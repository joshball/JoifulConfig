
var dependency =  {
    production: {
        auth: {
            host: 'https://podio.com',
            key_id: 'some-survey-prod',
            key_secret: { __envVar: 'PODIO_AUTH_KEY_SECRET' }
        },
        apps: {
            'SomeSurvey': { id: 'SomeSurveyId', name: 'SomeSurvey', token: { __envVar: 'PODIO_AUTH_SURVEY_TOKEN' } }
        }
    },
    development: {
        auth: {
            key_id: 'some-survey-dev'
        },
        apps: {
            'SomeSurvey': { id: 'SomeSurveyTestId', name: 'SomeSurvey_TEST' }
        }
    }
};

module.exports = dependency;