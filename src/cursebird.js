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

cursebird.like = function(score){
    if (score < 1)
        return "like a mute";
    if (score < 30)
        return "like a BBC News Presenter";
    if (score < 50)
        return "like the Oxford English Dictionary";
    if (score < 70)
        return "like a school teacher";
    if (score < 110)
        return "like Jack Bauer";
    if (score < 150)
        return "like a Scottish comedian";
    if (score < 200)
        return "like a Jersey girl";
    if (score < 320)
        return "like Gordon Ramsey";
    if (score < 500)
        return "like a gangsta rapper";
    if (score < 1000)
        return "like an enthusiastic pornstar";
    return "like a sailor";
};

module.exports = cursebird;