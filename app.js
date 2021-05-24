var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

var request = require('request');

app.use(express.static('public'));
let key = 'd38e842ac476454d18109f49c5cef3e6';


app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5321);



app.get('/',function(req,res,next){
  var context = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }
  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length || 0;
  context.toDo = req.session.toDo || [];
  console.log(context.toDo);
  res.render('toDo',context);
});



});
app.post('/',function(req,res){
  var context = {};

  if(req.body['New List']){
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('newSession', context);
    return;
  }

  if(req.body['Add Item']){
    req.session.toDo.push({"name":req.body.name, "city":req.body.city, "id":req.session.curId});
    // let context = {}
    // request('http://api.openweathermap.org/data/2.5/weather?q=' + req.body.city + '&APPID=' + key, function(err, response, body) {
    //   if (!err && response.statusCode < 400) {
    //     context.owm = body;
    //   } else {
    //     console.log(err);
    //     if (response) {
    //       console.log(response.statusCode);
    //     }
    //   }
    //   next(err);
    // })
    req.session.curId++;
  }

  if(req.body['Done']){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;
  console.log(context.toDo);
  res.render('toDo',context);
});

app.post('/', function(req, res, next) {
  let weather = {};
  request('http://api.openweathermap.org/data/2.5/weather?q=' + req.body.city + '&APPID=' + key, function(err, response, body){
    if (!err && response.statusCode < 400) {
      weather.owm = body;
      console.log(body)
    } else {
      console.log(err);
      if(response) {
        console.log(response.statusCode)
      }
    }
    next(err)
  });

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});