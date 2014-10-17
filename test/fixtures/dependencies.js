var dependencies = {
    "server": {
        prod: {
            host: 'prod.host.com',
            port: 80
        },
        test: {
            host: 'test.host.com',
            port: 8080,
            testExtra: {
                name: 'testExtra',
                num: 2
            }
        },
        dev: {
            host: 'dev.host.com',
            port: 2001,
            testExtra: {
                num: 4
            },
            devExtra: {
                name: 'devExtra',
                num: 3
            }
        },
        badTag: {
            host: 'badTag.host.com',
            port: 2002,
            badTagExtra: {
                name: 'badTagExtra',
                num: 4
            }
        }
    },
    "userDb": {
        "prod": {
            "url": "mongodbUrl"
        }
    },
    "realtimeDb": {
        "prod": {
            "url": "firebaseUrl",
            "token": "FIREBASE_SECRET_KEY"
        }
    },
    "logging": {
        "prod": {
            "level": "mongodbUrl",
            "host": "string",
            "port": "int"
        }
    }
};
module.exports = dependencies;
