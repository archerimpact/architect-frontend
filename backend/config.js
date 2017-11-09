const configData = {
    /* mlab acc - user: ofacasaurus; pass: m1chaelsBlueKettle */
    frontend_url: 'http://localhost:3000',
    db_url: 'mongodb://archer1:fanusie@ds011872.mlab.com:11872/redtwinedb',
    express_session_secret: 'sNGDGX1Kd5j4sQRYWE33',
    db_options: {
        useMongoClient: true,
        promiseLibrary: global.Promise,
        keepAlive: 1,
        connectTimeoutMS: 30000,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    },
};

module.exports = configData;