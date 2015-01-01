#!/usr/bin/env node
'use strict';

var options = {
    adapter: 'mongodb',
    connectionString: process.argv[2] || "‌mongodb://127.0.0.1:27017/testDB",
    db: 'testDB',
    inflect: true,
    es_index:'test-index',
    es_url: process.argv[3] || "http://127.0.0.1:9200"
};

before(function (done) {
    this.app = require('./app')(options)
        .catch(function (error) {
            done(error);
            process.exit(1);
        });
    done();
});
after(function (done) {
    this.app
        .then(function (fortuneApp) {
            fortuneApp.router.close();
            this.app = null;
        })
        .finally(function () {
            done();
        });
});
