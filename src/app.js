var sys = require('sys');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
var props = require('properties');
var wrapper = require('./requestwrapper');
var cursebird = require('./cursebird');
props.twitter = 'api.twitter.com';

var app = express.createServer();
app.use(express.staticProvider(__dirname + '/../public'));
app.use(express.bodyDecoder());

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.get('/:username/:listname', function(req, res){
    var username = req.params.username;
    var listname = req.params.listname;
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
                if (curses.length == users.length)
                    renderList(res, curses, listInfo);
            });
        }
    });
});

var renderList = function(response, curses, listInfo){
    curses.sort(function(a,b){
       return parseInt(a.level) < parseInt(b.level); 
    });
    
    response.render('list.ejs', {
        locals:{'curses':curses, 'listinfo': listInfo}
    });   
};

app.listen(props.port);
