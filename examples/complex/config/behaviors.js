var behaviors ={
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
        prod: { appCookie: { description: 'Application Cookie', secret: 'some_secret', lifetime: '{{ constants.monthInMs }}' } },
        test: { appCookie: { secret: 'some_other_secret' } }
    }
};

module.exports = behaviors;
