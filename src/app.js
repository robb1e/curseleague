var sys = require('sys');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
var http = require('http');
var props = require('properties');

var app = express.createServer();
app.use(express.staticProvider(__dirname + '/../public'));
app.use(express.bodyDecoder());

app.get('/', function(req, res){
	res.render('index.ejs');
});

app.listen(props.port);
