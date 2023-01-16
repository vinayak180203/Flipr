const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require("ejs");
var _ = require('lodash');
const fs  = require('fs');
const nse=require('./NSE.json')
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
mongoose.connect('mongodb://127.0.0.1/userDB');

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
          res.render('welcome'); 
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
  // const dataset = fs.readFile('NSE.json');
   res.render('welcome',{data : nse[nse.length-1].Date});
})

app.listen(3001, () => {
  console.log('Server started on port 3001!');
});``