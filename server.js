const MithVaultSDK = require('./dist/mith-vault-sdk.min.js');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/Mith', {
    useNewUrlParser: true
});
var bcrypt = require('bcrypt-nodejs');
const app = new express();
const menu = require('./models/menu');
const movie = require('./models/movie');
const account = require('./models/account');
const bodyParser = require('body-parser');

const clientId = '0bb0dc2308c147f3a6b9f47aee5fbf5e';
const clientSecret = '6bbd412f129674644d12c075336f1a7285cb586770e904049acc184174e25e66e036427201fab9a6dd2e3df81503e5eafd6750573fd5def49e695bf0d4511c88';
const miningKey = 'cf';
const sdk = new MithVaultSDK({
    clientId,
    clientSecret,
    miningKey
});

app.use(fileUpload());

app.get('/bindURI', function (request, response) {
    const url = sdk.getBindURI();
    response.status(200).send(url + "&user_id=" + request.query.user_id);
});

app.get('/delbindURI', function (request, response) {
    account.findOne({
        '_id': request.query.user_id
    }).exec(function (err, result) {
        sdk.delUnbindToken({
            token: result.token
        }).then(data => {
            console.log(data);
            result.token = null;
            response.status(200).send("OK");
        }).catch(error => {
            response.status(400).send("Error");
        });
    });
});

app.post('/uplaod_movie', function (request, response) {    
    new movie({
        'owner': request.query.user_id,
        'depend': request.query.menu_id,
        'movie': request.files.movie.data
    }).save(function (err, results) {
        if (err) {
            console.log(err);
            response.status(400).send("Error");
        } else {
            response.status(200).send("OK");
        }
    });
});

app.post('/create_menu', function (request, response) {
    new menu({
        'owner': request.query.user_id,
        'title': "menu_" + new Date(),
        'follower_amount': 0,
        'like_amount': 7,
        'dislike_amount': 3,
        'movie_amount': 0,
        'content': new Map([
            ["Day1 重訓", "暖身：\n5-10分鐘之心肺運動（50％HRR）\n重訓：\n坐姿胸推（MC）\n坐姿肩推（MC）\n滑輪下拉（MC) \n坐姿划船（MC）\n捲腹（NIC）\n伸展:\n胸大肌\n肱三頭肌\n肱二頭肌\n前三角肌\n中斜方肌\n闊背肌\n腹直肌"],
            ["Day2 有氧暖身", "5分鐘(50％HRR)\n主運動30分鐘(60-75％HRR)\n緩和：5分鐘(50％HRR)"],
            ["Day3 休息", ""],
            ["Day4 重訓", "暖身：\ns5-10分鐘之心肺運動（50％HRR）\n重訓：\n坐姿推蹬（MC）\n坐姿大腿伸張（MC）\n俯臥大腿彎曲（MC）\n舉踵（MC）\n羅馬椅背伸（MC）\n下腹擺腿（MA）\n伸展：\n臀大肌\n股四頭肌\n腿後肌群\n腓腸肌\n豎脊肌\n腹直肌"],
            ["Day5 有氧", "暖身：\n5分鐘50％HRR\n主運動:\n30分鐘60,75％HRR\n緩和：\n5分鐘50％HRR"],
            ["Day6 休息", ""],
            ["Day7 休息", ""],
        ])
    }).save(function (err, results) {
        if (err) {
            response.status(400).send("Error");
        } else {
            response.status(200).send("OK");

        }
    });
});

app.post('/login', function (request, response) {
    if (request.query.account && request.query.password)
        account.findOne({
            'account': request.query.account
        }).exec(function (err, result) {
            console.log(result);
            if (bcrypt.compareSync(request.query.password, result.password)) {
                response.status(200).send(result._id);
            } else {
                response.status(400).send("Error");
            }
        });
    else response.status(400).send("Input Error");
});

app.post('/signup', function (request, response) {
    if (request.query.account && request.query.password)
        new account({
            "account": request.query.account,
            "password": bcrypt.hashSync(request.query.password, bcrypt.genSaltSync(8), null)
        }).save(function (err, results) {
            if (err) {
                response.status(400).send("Error");
            } else {
                response.status(200).send(results._id);
            }
        });
    else response.status(400).send("Input Error");
});

app.get('/success', function (request, response) {
    console.log(request.query.grant_code);
    console.log(request.query.state);
    console.log(request.query.user_id);
    sdk.getAccessToken({
        grantCode: request.query.grant_code,
        state: request.query.state
    }).then(data => {
        console.log(data);
        account.updateOne({
            "_id": request.query.user_id
        }, {
            "token": data
        }).exec(function (err) {
            if (err) {
                console.log(err);
                response.status(400).send("Error");
            } else {
                response.status(200).send("Ok");
            }
        });
    }).catch(err => {
        console.log(err);
        response.status(400).send("Error");
    });
});

app.get('/faillure', function (request, response) {
    response.status(400).send("Error");
});

app.listen(5000);
console.log("Running at Port 5000");