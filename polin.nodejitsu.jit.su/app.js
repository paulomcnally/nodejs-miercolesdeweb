/* ------------------------------------------
node.js v0.6.15 (http://nodejs.org/)
2013-02-01 22:32:12 -0600
http://polin.nodejitsu.jit.su
Servidor web que recibe parametros por get y los envía mediante WebSocket al cliente.
@paulomcnally
------------------------------------------ */



/* ------------------------------------------
Mongodb
------------------------------------------ */ 
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://appfog:polin@linus.mongohq.com:10039/fb_slideshow_paulomcnally');

var schema = mongoose.Schema({ number: 'string', text: 'string', id: 'string' });

var Sms = db.model('Sms', schema);

var Message = db.model('Sms'); 




function strip_tags (input, allowed) {
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}



/*


/* ------------------------------------------
WebServer
------------------------------------------ */ 
//var sys = require ('sys'),
var sys = require(process.binding('natives').util ? 'util' : 'sys'),
url = require('url'),
http = require('http'),
querystring = require('querystring');
var crypto = require('crypto');


var server = http.createServer(function (req, res){
  switch( req.method ){
    case 'GET':
      var GET = url.parse(req.url,true);
                        if( GET.search != "" ){
                                GET.query.id = crypto.createHash('md5').update(new Date().toISOString()).digest("hex");

                                GET.query.text = strip_tags(GET.query.text,'<a>')

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

    case 'POST':
      req.addListener('data', function(chunk){
         var POST = querystring.parse(chunk);
         ws_sendData( POST );
         console.log(POST);
        });
    break;
  }

  // Close load page
  res.writeHead(200, {'Content-Type': 'text/plain'});
    
  res.end('{"status":true}\n');
  });

server.listen(80);

/* ------------------------------------------
WebSocket
socket.io
http://socket.io
------------------------------------------ */
var WebSocket = require("socket.io").listen( server );

WebSocket.sockets.on("connection", ws_start);

function ws_start(data){
  data.on("new_message", ws_sendData);
}

function ws_sendData(data){
  WebSocket.sockets.emit("ws_getData",data);
}