// server.js
const app = require('../app');

// port 
const port = process.env.port || 3000;

const server = app.listen(port, function(err) {
    if (err) console.log("There was an error starting the server on port ",server.address().port);
    console.log("Server is running on port:",server.address().port);
});