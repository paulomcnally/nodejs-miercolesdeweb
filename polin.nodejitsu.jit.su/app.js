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

var db = mongoose.createConnection('mongodb://nodejitsu:a4e657d07ae5c1092f52efa80a536fbd@linus.mongohq.com:10010/nodejitsudb3859585665');

var schema = mongoose.Schema({ number: 'string', text: 'string', id: 'string' });

var Sms = db.model('Sms', schema);

var Message = db.model('Sms'); 

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