var sanitize = require('validator').sanitize

/* ------------------------------------------
Mongodb
------------------------------------------*/

var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://nodejitsu:a4e657d07ae5c1092f52efa80a536fbd@linus.mongohq.com:10010/nodejitsudb3859585665');

var schema = mongoose.Schema({ number: 'string', text: 'string', id: 'string' });

var Sms = db.model('Sms', schema);

var Message = db.model('Sms'); 



/*


kitty.save(function (err) {
  if (err) {
		console.log(err);
	}
  console.log( kitty );
});

console.log( Message.find({name:'Zildjian'}) );
*/

function strip_tags (input, allowed) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Luke Godfrey
  // +      input by: Pul
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +      input by: Alex
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Marc Palau
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Eric Nagel
  // +      input by: Bobby Drake
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Tomasz Wesolowski
  // +      input by: Evertjan Garretsen
  // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
  // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
  // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
  // *     returns 2: '<p>Kevin van Zonneveld</p>'
  // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
  // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
  // *     example 4: strip_tags('1 < 5 5 > 1');
  // *     returns 4: '1 < 5 5 > 1'
  // *     example 5: strip_tags('1 <br/> 1');
  // *     returns 5: '1  1'
  // *     example 6: strip_tags('1 <br/> 1', '<br>');
  // *     returns 6: '1  1'
  // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
  // *     returns 7: '1 <br/> 1'
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}




/* ------------------------------------------
WebApp
------------------------------------------ */
var express = require('express');
var fs      = require('fs');
var views   = require('./models/views');

var app = express();

var html = "";

/* Create public directory */
app.use(express.static(__dirname + '/public'))

/* Load index page */
app.get('/', function(req, res){

	var html = "";

	html = views.load('index.html',fs);

	var query = Message.find({},function(err, records){
		if(err ){
			
		}
		else{
			if( records.length != 0 ){
				for (var i in records) {
 					records[i].text = strip_tags( records[i].text, '<a>' );
				}

				var str = sanitize( JSON.stringify( records ) ).xss();

				html = html.replace('@json_data', str );
			}
			else{
				html = html.replace('@json_data', '[{"number":"82749763","text":"Envia tus preguntas al 82749763","id":"c3a4a581e9acd930ff81615cf32ae26c"}]' );
			}

			
		}

    	res.writeHead(200, {'Content-Type' : 'text/html'});
    	res.end( html );
  	});

    
});

/* Load about page 

app.get('/about', function(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end( views.load('about.html',fs) );
});
*/
app.listen( process.env.VCAP_APP_PORT || 3000 );




/* ------------------------------------------
WebSocket
socket.io
http://socket.io
------------------------------------------

var WebSocket = require("socket.io").listen( 8081 );

WebSocket.sockets.on("connection", ws_start);

function ws_start(data){
	data.on("new_message", ws_sendData);
}

function ws_sendData(data){
	WebSocket.sockets.emit("ws_getData",data);
}
 */


/* ------------------------------------------
WebServer
------------------------------------------ 
//var sys = require ('sys'),
var sys = require(process.binding('natives').util ? 'util' : 'sys'),
url = require('url'),
http = require('http'),
querystring = require('querystring');
var crypto = require('crypto');


http.createServer(function (req, res){
	switch( req.method ){
		case 'GET':
			var GET = url.parse(req.url,true);
			if( GET.search != "" ){
				GET.query.id = crypto.createHash('md5').update(new Date().toISOString()).digest("hex");

				var sms_data = new Sms( GET.query );

				sms_data.save(function (err) {
  					if (err) {
						console.log(err);
					}
  				console.log( sms_data );
				});

				ws_sendData( GET.query );
			}
			console.log(GET.query);
		break;
	}

	// Close load page
	res.writeHead(200, {'Content-Type': 'text/plain'});
  	
	res.end('Success');
	
}).listen( 8082 );

*/ 



/* ------------------------------------------
IP
------------------------------------------ 
var os = require('os')

var interfaces = os.networkInterfaces();
var addresses = [];
for (k in interfaces) {
    for (k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

console.log(addresses)

*/ 



app.get('/:id', function (req, res){
	var query = Message.find({ id: req.params.id }).remove();

	res.redirect('/');
  
});



