var cursebird = {};
var wrapper = require('./requestwrapper');
var cache = require('./cache');
var props = {
  host : 'cursebird.com'  
};

cursebird.lookup = function(username, callback){
    var key = "cursebird:/" + username;
    if (cache.exists(key)){
        console.log("cache hit on " + key);
        callback(cache.get(key));
    } else {    
        console.log("cache miss on " + key);
        wrapper.request(props.host, "/" + username + ".json", function(data){
            data.username = username;
            cache.put(key, data);
            callback(data);
        });
    }
};

module.exports = cursebird;