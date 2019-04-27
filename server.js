const MithVaultSDK = require('./dist/mith-vault-sdk.min.js');
const express = require('express');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/Mith', {
  useNewUrlParser: true
});
var bcrypt = require('bcrypt-nodejs');
const app = new express();
const recipe = require('./models/recipe');
const account = require('./models/account');

const clientId = '0bb0dc2308c147f3a6b9f47aee5fbf5e';
const clientSecret = '6bbd412f129674644d12c075336f1a7285cb586770e904049acc184174e25e66e036427201fab9a6dd2e3df81503e5eafd6750573fd5def49e695bf0d4511c88';
const miningKey = 'cf';
const sdk = new MithVaultSDK({
    clientId,
    clientSecret,
    miningKey
});

// sdk.getUserMiningAction({ token: userToken }).then(data => {

// }).catch(error => {

// });

app.get('/bindURI', function (request, response) {
    const url = sdk.getBindURI();
    response.status(200).send(url+"&user_id="+request.query.user_id);
});

app.get('/delbindURI', function (request, response) {
    account.findOne({
        '_id': request.query.user_id
    }).exec(function (err, result) {
        sdk.delUnbindToken({ token : result.token }).then(data => {
            console.log(data);
            response.status(200).send("OK");
        }).catch(error => {
            response.status(500).send("Error");
        });
	});
});

app.post('/login', function (request, response) {
    account.findOne({
        'account': request.query.account
    }).exec(function (err, result) {
        console.log(result);
		if (bcrypt.compareSync(request.query.password, result.password)) {
            response.status(200).send(result._id);
        }
        else {
            response.status(500).send("Error");
        }
	});
});

app.post('/signup', function (request, response) {
    new account({
        "account": request.query.account,
        "password": bcrypt.hashSync(request.query.password, bcrypt.genSaltSync(8), null)
    }).save(function (err, results) {
        if (err) {
            response.status(500).send("Error");
        } else {
            response.status(200).send(results._id);
        }
    });
});

app.get('/success', function (request, response) {    
    console.log(request.query.grant_code);
    console.log(request.query.state);
    console.log(request.query.user_id);
    sdk.getAccessToken({
        grantCode : request.query.grant_code,
        state : request.query.state
    }).then(data => {
        console.log(data);
        account.updateOne({
			"_id": request.query.user_id
		}, {
			"token": data
		}).exec(function (err) {
			if (err) {
				res.send("There was a problem updating the information to the database.");
			} else {
				res.redirect("/");
			}
		});
        response.status(200).send("OK");
    }).catch(error => {
        response.status(500).send("Error");
    });
});

app.get('/faillure', function (request, response) {
    response.status(500).send("Error");
});


app.listen(5000);
console.log("Running at Port 5000");