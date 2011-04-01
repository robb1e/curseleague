var sys = require('sys');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
var wrapper = require('./requestwrapper');
var cursebird = require('./cursebird');
var props = {};
props.twitter = 'api.twitter.com';

var app = express.createServer();
app.use(express.static(__dirname + '/../public'));
//app.use(express.bodyDecoder());

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/:username/:listname', function(req, res){
    var username = req.params.username;
    var listname = req.params.listname;
    getList(username, listname, function(curses, listInfo){
        res.render('list.ejs', {
            locals:{'curses':curses, 'listinfo': listInfo}
        }); 
    });
});

app.get('/:username/:listname/vs/:otherusername/:otherlistname', function(req, res){
    var username = req.params.username;
    var listname = req.params.listname;
    var result = {
        first : {},
        second: {}
    };
    getList(username, listname, function(curses, listInfo){
        result.first = {'curses':curses, 'listinfo': listInfo};
        if (result.second !== {})
            renderVerses(res, result);
    });    
    getList(req.params.otherusername, req.params.otherlistname, function(curses, listInfo){
        result.second = {'curses':curses, 'listinfo': listInfo};
        if (result.first !== {})
            renderVerses(res, result);
    });
});

var renderVerses = function(res, data){
    
    console.log("calling render with " + JSON.stringify(data));
    
    res.render('vs.ejs', {
        locals:{'first':{'curses':data.first.curses, 'listinfo':data.first.listinfo}, 'second':{'curses':data.second.curses, 'listinfo':data.second.listinfo}}
    });
};

var getList = function(username, listname, callback){
    var path = '/1/' + username + '/' + listname + '/members.json';
    var listInfo = {
        path: '/1/' + username + '/lists/' + listname + '.json',
        name:''
    };
    wrapper.request(props.twitter, listInfo.path, function(data){
        listInfo.name = data.description;
    });
    wrapper.request(props.twitter, path, function(data){
        var users = data.users;
        var curses = [];
        for (i = 0; i < users.length; i++){
            var screen_name = users[i].screen_name;
            cursebird.lookup(screen_name, function(data){   
                var user = {
                    level : data.level,
                    username : data.username,
                    like: data.swears_like
                };
                curses.push(user);
                if (curses.length == users.length){
                    curses.sort(function(a,b){
                       return parseInt(b.level) - parseInt(a.level); 
                    });
                    callback(curses, listInfo);
                }
            });
        }
    });
};

app.listen(80);
