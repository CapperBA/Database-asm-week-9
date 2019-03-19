const knex = require('./databaseconnection')
module.exports.insert = function (tablename, schema) {
    knex(tablename).insert(schema)
        .then(() => console.log("data inserted"))
        .catch((err) => {
            console.log(err);
            throw err
        })
    // .finally(() => {
    //     knex.destroy();
    // });
}

module.exports.selectAll = function (tablename, callback) {
    knex.from(tablename).select('*')
        .then((rows) => {
            callback(rows)
            // for (row of rows) {
            //     console.log(`${row['id']} | ${row['username']} | ${row['password']} | ${row['street']} | ${row['number']} | ${row['floor']} | ${row['zipcode']} | ${row['city']}`);
            // }
        }).catch((err) => {
            console.log(err);
            throw err
        })
    // .finally(() => {
    //     knex.destroy();
    // });
}

module.exports.select = function (tablename, query, where, callback) {
    knex.from(tablename).select(query).where(where)
        .then((rows) => {
            callback(rows)
            // for (row of rows) {
            //     console.log(`ID: ${row['id']}`);
            // }
        }).catch((err) => {
            console.log(err);
            throw err
        })
    // .finally(() => {
    //     knex.destroy();
    // });
}