const databasecredentials = require('../database_credentials/database_credentials');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: databasecredentials.host,
        user: databasecredentials.username,
        password: databasecredentials.pw,
        database: databasecredentials.dbname
    }
});

// knex.raw("SELECT VERSION()").then(
//         (version) => console.log("CONNECTED TO DATABASE\n----------------------------\n",(version[0][0]))
//     ).catch((err) => {
//         console.log("UNABLE TO CONNECT TO DATABASE\n----------------------------\n",err);
//         throw err
//     })
//     .finally(() => {
//         knex.destroy();
//     });

module.exports = knex;