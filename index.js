/**
 * @author mmishra
 * @email mm62810@yahoo.com
 * @create date 2018-10-26 10:27:02
 * @modify date 2018-10-26 10:27:02
 * @desc Primary file for RestFul API
*/

//Dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');


// Instantiate HTTP server
var httpServer = http.createServer(function (req, res) {

    unifiedServer(req, res);
});

//Define httpsServerOptions
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

// Instantiate HTTPS server
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {

    unifiedServer(req, res);
});

//Start The server and have it to listen on port 3000

httpServer.listen(config.httpPort, function () {
    console.log("The http server is listning on port: " + config.httpPort + " in " + config.envName + " mode.");
});

httpsServer.listen(config.httpsPort, function () {
    console.log("The https server is listning on port: " + config.httpsPort + " in " + config.envName + " mode.");
});

//All the server logic for both http and https server
var unifiedServer = function(req, res){
  //Get the url and parse it.
  var parsedUrl = url.parse(req.url, true);

  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '')

  //Get query string as object
  var queryStringObject = parsedUrl.query;

  //Get the HTTP method
  var method = req.method.toLocaleLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  //Get the payload, if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on('data', function (data) {
      buffer += decoder.write(data);
  });

  req.on('end', function () {
      buffer += decoder.end();

      //choose the handler this request should go to. if one is not found, use the not found handler

      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;

      //Construct data object to sent to handler
      var data = {
          "trimmedPath": trimmedPath,
          "queryStringObject" : queryStringObject,
          "method": method,
          "headers" : headers,
          "payload" : buffer
      };

      //Route the request to handler specified in router
      chosenHandler(data, function(statuCode, payload){
          //Use the status code called back by the handler, or default to 200
          statuCode = typeof(statuCode) == 'number' ? statuCode : 200;

          //Use the paylad called back by the handler, or default to an empty object
          payload = typeof(payload) == 'object' ? payload : {};

          //Convert the payload to a string 
          var payloadString = JSON.stringify(payload);

          //Return the response
          res.setHeader('Conent-Type', 'application/json');
          res.writeHead(statuCode);
          
          res.end(payloadString);

          //Log the request path

          console.log('returning this response ', statuCode, payloadString);
      });
      
  })

};


//Defin a handler
var handlers = {};

//Ping handler 
handlers.ping = function (data, callBack) {

    callBack(200)
};

//Hello handler 
handlers.hello = function (data, callBack) {

    //callback a http status code and a payload object
    callBack(406, { "message": "Welcome to Hello World!!!" })
};

//Not found handler
handlers.notfound = function (data, callback) {
    callback(404);

};

//Define a request router
var router = {
    "hello": handlers.hello,
    "ping" : handlers.ping
}