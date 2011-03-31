var cursebird = {};
var wrapper = require('./requestwrapper');
var props = {
  host : 'cursebird.com'  
};

cursebird.lookup = function(username, callback){
    wrapper.request(props.host, "/" + username + ".json", function(data){
        data.username = username;
        callback(data);
    });
};

module.exports = cursebird;