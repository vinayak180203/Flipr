const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require("ejs");
var _ = require('lodash');
const fs  = require('fs');

var plotly = require('plotly')("Azkairah", "eZnIexyOlWCdttsdf87d");


// const alert = require('alert');
// var popupS = require('popupS');
// var swal = require('sweetalert');
// const popup = require('node-popup');
// const popup = require('node-popup/dist/cjs.js');
// var jsdom = require("jsdom");
// var JSDOM = jsdom.JSDOM;
// global.document = new JSDOM(html).window.document;
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://vinayakkesarwani18:gyan26suman@cluster0.rasaaxd.mongodb.net/userDB");

app.set('view engine', 'ejs');
app.use(express.static("public"));

const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User',usersSchema);

app.get('/', (req, res) => {
  res.render('home');
});


app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', (req, res) => {
  User.findOne({email: req.body.email}, (err, userAlready) => {
    if(err) throw err;
    if(userAlready){
      res.redirect('/register');
    }
    else{
      const user = new User({
        email: req.body.email,
        password: req.body.password
      });
      user.save()
        .then(() => {
          res.redirect('welcome');
        })
        .catch(error => {
          res.status(400).json({ error });
        });
    }
  });
});

app.get('/signin', function(req, res){
  res.render('signin');
});

app.post('/signin', function(req, res){
  User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] }, (err, foundedUser) => {
  // if (err) throw err;
  if (foundedUser) {
    res.redirect('welcome');
  } else {
    res.redirect('/signin')
  }
});
});

app.get('/welcome', function(req,res){
  const nse = require('./nse.json')
  const time=[];
  const closedata=[];
  for(var i=0;i<nse.length;i++){
    time.push(nse[i].Date);
    closedata.push(nse[i].Close);
  }
  var data = [
    {
      x: time,
      y: closedata,
      type: "scatter"
    }
  ];
  var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
   res.render('welcome',{today_date : nse[nse.length-1].Date,
                        today_price:nse[nse.length-1].Close,
                        today_open:nse[nse.length-1].Open,
                        today_high:nse[nse.length-1].High,
                        today_low:nse[nse.length-1].Low,
                        yesterday_close:nse[nse.length-2].Close,
                        today_gain:nse[nse.length-1].Close-nse[nse.length-2].Close});
});

app.get('/welcome/:stock', function(req, res){
  var stockName = req.params.stock;
  var stockN = require('./'+stockName+'.json')
  const time=[];
  const closedata=[];
  for(var i=0;i<stockN.length;i++){
    time.push(stockN[i].Date);
    closedata.push(stockN[i].Close);
  }
  var data = [
    {
      x: time,
      y: closedata,
      type: "scatter"
    }
  ];
  var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
   res.render('welcome',{today_date : stockN[stockN.length-1].Date,
                        today_price:stockN[stockN.length-1].Close,
                        today_open:stockN[stockN.length-1].Open,
                        today_high:stockN[stockN.length-1].High,
                        today_low:stockN[stockN.length-1].Low,
                        yesterday_close:stockN[stockN.length-2].Close,
                        today_gain:stockN[stockN.length-1].Close-stockN[stockN.length-2].Close});
});

app.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

app.listen(3001, () => {
  console.log('Server started on port 3001!');
});
