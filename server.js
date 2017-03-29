//Egy egyszerű fórum node.js-ben

//inicializáltam pár fontos package-t
const express = require('express');   //ez egy web application framework, segít egy egyszerű webszervert létrehozni
const MongoClient = require('mongodb').MongoClient;   //ez egy NOSQL adatbázis
const bodyParser = require('body-parser');	// az express nem kezeli az adatok olvasását a <form> html elemből, ezért van szükség erre a middleware cuccra
const app = express();

var db;
var url = 'mongodb://localhost:27017/my_forum_database';  //url változóba tettem a file

//az use metódussal hozzáadható az expresshez egyÈb middleware 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//beállítottam egy template engine-t, aminek a segítségével megjeleníteni a HTML-t
app.set('view engine', 'ejs');

//GET HTML kérés ami az index.html file mutat, ez lesz a kiinduló helyzet a localhost:3000/messages
app.get('/messages',function (req,res) {
	res.sendFile(__dirname + '/index.html');
});

//adatbázis csatlakozzása
MongoClient.connect(url, function (err, database) {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function() {       
    console.log('!!!listening on 3000');
  });
});

//ez jeleníti majd meg a beírt üzeneteket, ezbben van a template engine
app.get('/', function (req, res)  {
  db.collection('messages').find().toArray(function(err, result) {
   if (err) return console.log(err);
    // renders index.ejs
    res.render('index.ejs', {messages: result});
  });
});

//itt jön létre a "messages" tábla, majd ebbe mentődik az adat
app.post('/messages', function (req, res) {
  db.collection('messages').save(req.body, function (err, result) {
    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  });
});
