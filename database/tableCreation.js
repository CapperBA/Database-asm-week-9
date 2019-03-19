const knex = require('./databaseconnection')

knex.schema.createTable('user', (table) => {
        table.increments('id').notNullable()
        table.string('username')
        table.string('password')
        table.string('street')
        table.string('number')
        table.string('floor')
        table.string('zipcode')
        table.string('city')
    }).then(() => console.log("Table created"))
    .catch((err) => {
        console.log(err);
        throw err
    })
    .finally(() => {
        knex.destroy();
    });

//knex.schema.dropTable('user')