var http = require('http'),
    url = require('url'),
    sys = require('sys'),
    port = 8888;

//require custom dispatcher
var dispatcher = require('./lib/dispatcher.js');

console.log('Starting server @ http://127.0.0.1:' + port + '/');

var server = http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/html'});

  // from http://www.jblotus.com/2011/05/30/building-your-first-node-js-app-%E2%80%93-part-2-building-the-web-server-and-request-dispatcher/
  //wrap calls in a try catch or the node js server will crash upon any code errors
  try {
    //pipe some details to the node console
    console.log('Incoming Request from: ' +
                 req.connection.remoteAddress +
                ' for href: ' + url.parse(req.url).href
   );

    //dispatch our request
    dispatcher.dispatch(req, res);

  } catch (err) {
    //handle errors gracefully
    sys.puts(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }

}).listen(port, "127.0.0.1", function() {
  console.log("Server running http://127.0.0.1/" + port);
});

