var http = require('http');
var request = {};

request.request = function(host, path, callback){
    console.log("requesting: " + host + path);
    var connection = http.createClient(80, host);
    var request = connection.request('GET', path, {'host':host, 'user-agent':'curseleague.com'});
    request.end();
    request.on('response', function(response){
        var data = "";
        response.setEncoding('utf8');
        response.on('data', function(chunk){
            data += chunk;
        });
        response.on('end', function(){
            callback(JSON.parse(data));
        });
    });   
};

module.exports = request;