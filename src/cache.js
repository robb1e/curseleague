var fs = require('fs');
var cache = {
    file: __dirname + '/../data/cache.json'
};

cache.put = function(key, value){
    console.log('upserting key ' + key);
    cache.store[key] = value;  
    cache.save();
};

cache.get = function(key){
    return cache.store[key];
};

cache.exists = function(key){
    return cache.store[key] != undefined;
};

cache.save = function() {
    console.log("saving cache.store");
    fs.writeFile(cache.file, JSON.stringify(cache.store), 'utf8', function(err){
    	if (err) { throw err; }
    	console.log('Saved data to ' + cache.file);
	});  
};

cache.read = function(){
    cache.store = JSON.parse(fs.readFileSync(cache.file, 'utf8'));
};

cache.read();
module.exports = cache;
