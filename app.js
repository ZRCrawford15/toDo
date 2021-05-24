let express = require('express');

let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let session = require('express-session');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extend: false}));
app.use(session({secret: 'password'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 23950);


app.get('/count', function(req, res) {
	let context = {};
	context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('count', context)
});

app.post('/count', function(req, res) {
	let context = {};
	if (req.body.command === "resetCount"){
		req.session.count = 0;
	} else {
		context.err = true;
	}
	context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('count', context);

})


app.listen(app.get('port'), function(){
	console.log("express started on http://localhost:" + app.get('port') + "; press Ctrl-C to terminate.");
})
