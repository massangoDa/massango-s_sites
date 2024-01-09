const express = require('express')
const si = require('systeminformation');
const path = require('path')
const PORT = 443
var https = require('https');
const fs = require('fs');
const randomstring = require('randomstring');
const io = require("socket.io");
const request = require("request");
const csurf = require('csurf');
const cookieParser = require('cookie-parser');


const app = express()

const messages = [];

app.use(cookieParser());

app.use(csurf({ cookie: true }));

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  next();
});


// リクエストボディをパースするためのミドルウェアを追加
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'views'))




var server = https.createServer(options, app);

server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}!`);
});


const socketServer = io(server); // socket.io の初期化

socketServer.on("connection", (socket) => {
    const userIP = socket.request.connection.remoteAddress;
    console.log(`ユーザーが接続しました。IP: ${userIP}`);

    socket.emit('chat history', messages);

    socket.on("chat message", (msg) => {
        console.log('メッセージ:', msg);
        messages.push(msg);

        socketServer.emit('chat message', msg);
    });
});

app.post('/search', (req, res) => {
    const query = req.body.query;
    const searchURL = `https://www.google.com/search?q=${query}`;
    
    request(searchURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body); // レスポンスを直接送信する
        } else {
            res.send('Error');
        }
    });
});

app.get('/url', (req, res) => {
    const url = req.query.q; // リクエストからURLを取得

    // 指定されたURLにGETリクエストを送信して、結果を返す
    request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // レスポンスヘッダーのContent-Typeを設定
            res.setHeader('Content-Type', response.headers['content-type']);
            res.send(body); // レスポンスを直接送信する
        } else {
            res.send('Error');
        }
    });
});


app.post('/picture', (req, res) => {
    const query = req.body.query;
    const searchURL = `https://www.google.com/search?q=${query}&tbm=isch`;

    // Google画像検索に対するGETリクエストを送信
    request(searchURL, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body); // Google画像検索結果を直接送信
        } else {
            res.send('Error');
        }
    });
});


let currentWeather = generateRandomWeather();
let currentSolarPower = generateSolarPowerByWeather(currentWeather);  // 初期の発電量を生成

app.get('/weather', (req, res) => {
  res.send(currentWeather);
});

app.get('/solarPower', (req, res) => {
  const solarPowerData = {
    timestamp: new Date().toLocaleTimeString(),
    currentPower: currentSolarPower  // 生成済みの発電量を使用
  };
  res.json(solarPowerData);
});

// 1時間ごとに新しい天気を生成
setInterval(() => {
  currentWeather = generateRandomWeather();
  currentSolarPower = generateSolarPowerByWeather(currentWeather);
}, 60 * 60 * 1000);

// 24時間ごとに新しい天気を生成
setInterval(() => {
  currentWeather = generateRandomWeather();
}, 24 * 60 * 60 * 1000);

function generateRandomWeather() {
  const weatherOptions = ['晴れ', '曇り', '雨'];
  const chosenWeather = randomChoice(weatherOptions);
  return chosenWeather;
}

function generateSolarPowerByWeather(weather) {
  switch (weather) {
    case '晴れ':
      return Math.random() * 15;
    case '曇り':
      return Math.random() * 10;
    case '雨':
      return Math.random() * 5;
    default:
      return 0;
  }
}

function randomChoice(choices) {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}








 
// 404 ページを表示するためのミドルウェアを追加
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});



