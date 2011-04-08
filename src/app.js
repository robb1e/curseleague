var sys = require('sys');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
var wrapper = require('./requestwrapper');
var cursebird = require('./cursebird');
var twitter = require('./twitter');
var cache = require('./cache');
var props = {};
props.twitter = 'api.twitter.com';

var app = express.createServer();
app.use(express['static'](__dirname + '/../public'));

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/about', function(req, res){
    res.render('about.ejs');
});

app.get('/:username/:listname', function(req, res){
    var username = req.params.username;
    var listname = req.params.listname;
    getList(username, listname, function(curses, listInfo, level){
        res.render('list.ejs', {
            locals:{'curses':curses, 'listinfo': listInfo, 'level': level, 'average': Math.round(level / curses.length), 'listlike': cursebird.like(Math.round(level / curses.length))}
        }); 
    });
});

app.get('/:username/:listname/vs/:otherusername/:otherlistname', function(req, res){
    var username = req.params.username;
    var listname = req.params.listname;
    var result = {};
    getList(username, listname, function(curses, listInfo, level){
        result.first = {'curses':curses, 'listinfo': listInfo, 'level': level, 'average': Math.round(level / curses.length), 'listlike': cursebird.like(Math.round(level / curses.length))};
        if (result.second != undefined)
            renderVerses(res, result);
    });    
    getList(req.params.otherusername, req.params.otherlistname, function(curses, listInfo, level){
        result.second = {'curses':curses, 'listinfo': listInfo, 'level': level, 'average': Math.round(level / curses.length), 'listlike': cursebird.like(Math.round(level / curses.length))};
        if (result.first != undefined)
            renderVerses(res, result);
    });
});

var renderVerses = function(res, data){
    res.render('vs.ejs', {
        locals:{'first':{'curses':data.first.curses, 'listinfo':data.first.listinfo, 'level': data.first.level, 'average': Math.round(data.first.level / data.first.curses.length), 'listlike': cursebird.like(Math.round(data.first.level / data.first.curses.length))}, 
        'second':{'curses':data.second.curses, 'listinfo':data.second.listinfo, 'level': data.second.level, 'average': Math.round(data.second.level / data.second.curses.length), 'listlike': cursebird.like(Math.round(data.second.level / data.second.curses.length))}}
    });
};

var getList = function(username, listname, callback){
    
    if (cache.exists('app:/' + username + '/' + listname)){
        console.log("cache hit on app:/" + username + '/' + listname);
        var data = cache.get('app:/' + username + '/' + listname);
        callback(data.curses, data.listInfo, data.level);
    } else {
        _getList(username, listname, callback);
    }
};

var _getList = function(username, listname, callback){    
    var path = '/1/' + username + '/' + listname + '/members.json';
    var listInfo = {
        path: '/1/' + username + '/lists/' + listname + '.json',
        name:''
    };
    wrapper.request(props.twitter, listInfo.path, function(data){
        listInfo.name = data.description;
    });

    twitter.getListMembers(username, listname, function(users){
       var curses = []; 
       var level = 0;
       for (i = 0; i < users.length; i++){
           var screen_name = users[i];
           cursebird.lookup(screen_name, function(data){   
               var user = {
                   level : data.xp_score,
                   username : data.username,
                   like: data.swears_like
               };
               level += parseInt(data.xp_score);
               curses.push(user);
               if (curses.length == users.length){
                   curses.sort(function(a,b){
                      return parseInt(b.level) - parseInt(a.level); 
                   });
                   var data = {'curses': curses, 'listInfo': listInfo, 'level': level};
                   cache.put('app:/' + username + '/' + listname, data);
                   callback(curses, listInfo, level);
               }
           });
       }
    });
};

app.get("*", function(req, res){
    res.render('404.ejs', {status:404});
});

app.error(function(err, req, res, next){
    console.log("EXPRESS CAUGHT ERROR: " + err.message);
    res.render('500.ejs', {status:500}); 
});

process.on('uncaughtException',function(error){
    console.log("SYSTEM CAUGHT ERROR: " + error); 
    throw new NotFound;
});

app.listen(3000);
