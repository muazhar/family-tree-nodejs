
var dbs = {

    databases: {
        woodbridge: {
            dbURL: {
                adapter: 'sqlite3',
                database: 'db/woodbridge/woodbridge.db',
                read_only: 1
            },
            params: {
                title: 'Woodbridge Family Tree',
                owner: 'Stephen Woodbridge',
                email: 'stephenwoodbridge37 (at) gmail (dot) com',
                copyright: "Family Data Copyright 2001-2018 by Stephen Woodbridge, All Rights Reservered."
            }
        },
        woodbridge_record: {
            dbURL: {
                adapter: 'sqlite3',
                database: 'db/woodbridge_record/woodbridge_record.db',
                read_only: 1
            },
            params: {
                title: 'Woodbridge Record Book',
                owner: 'Stephen Woodbridge',
                email: 'stephenwoodbridge37 (at) gmail (dot) com',
                copyright: "Family Data Copyright 2001-2018 by Stephen Woodbridge, All Rights Reservered."
            }
        }
    },

    createConnection: function (dbName) {

        var dbURL = dbs.databases[dbName]['dbURL'];
        if (typeof dbURL === 'undefined') {
            console.error("Database '" + dbName + "' is not configured!");
            return null;
        }

        var anyDB = require('any-db');

        var conn = anyDB.createPool(dbURL);
        conn['adapter'] = dbURL.adapter;

        return conn;
    }
};

module.exports = dbs;
