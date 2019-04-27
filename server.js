const express = require('express');
const app = new express();

app.get('/', function (request, response) {
    res.status(200).send('OK');
});

app.listen(3000);
console.log("Running at Port 3000");