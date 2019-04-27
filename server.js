const MithVaultSDK = require('./dist/mith-vault-sdk.min.js');
const express = require('express');
const mongoose = require('mongoose');
const app = new express();
const recipe = require('./models/recipe');

const clientId = '0bb0dc2308c147f3a6b9f47aee5fbf5e';
const clientSecret = '6bbd412f129674644d12c075336f1a7285cb586770e904049acc184174e25e66e036427201fab9a6dd2e3df81503e5eafd6750573fd5def49e695bf0d4511c88';
const miningKey = 'cf';
const sdk = new MithVaultSDK({ clientId, clientSecret, miningKey });

// sdk.getUserMiningAction({ token: userToken }).then(data => {
  
// }).catch(error => {
  
// });

app.get('/', function (request, response) {
    response.status(200).send(sdk.getBindURI());
});

app.get('/success', function (request, response) {
    console.log(req.query.grant_code)
    console.log(req.query.state)
});

app.get('/faillure', function (request, response) {
    console.log(req.query.grant_code)
    console.log(req.query.state)
});


app.listen(3000);
console.log("Running at Port 3000");