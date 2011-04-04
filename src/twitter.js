var wrapper = require('./requestwrapper');
var cache = require('./cache');
var props = {};
props.twitter = 'api.twitter.com';
var twitter = {};

twitter.getListMembers = function(username, listname, callback){
    var key = 'twitter:/1/' + username + '/' + listname + '/members.json';
    if (cache.exists(key)) {
        console.log("cache hit on " + key);
        callback(cache.get(key));
    } else {
        console.log("cache miss on " + key);
        twitter._getListMembers(username, listname, -1, [], callback);
    }
};

twitter._getListMembers = function(username, listname, cursor, users, callback){
    var path = '/1/' + username + '/' + listname + '/members.json?cursor=' + cursor;
    wrapper.request(props.twitter, path, function(data){
        
        var usernames = [];
        for (i = 0; i < data.users.length; i++){
            usernames.push(data.users[i].screen_name);
        }
        
        if (data.next_cursor != "0"){
            twitter._getListMembers(username, listname, data.next_cursor, usernames.concat(users), callback);
        } else {
            var u = usernames.concat(users);
            cache.put('twitter:' + path, u);
            callback(u);
        }
    });    
};

module.exports = twitter;