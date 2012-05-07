// Config section
var port = (process.env.VMC_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0'|| 'localhost');

var express = require('express');
var server = express.createServer();
server.use(express.static(__dirname));

server.listen(port, host);
console.log('http://'+host+':'+port+'/');
