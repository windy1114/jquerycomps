var compressor = require('node-minify'); 
var fs = require('fs');

var path = '../JC.js';

new compressor.minify({
    type: 'yui-js',
    fileIn: path,
    fileOut: path,
    callback: function(err){
        console.log('js: ' + err  + ' : ' +  path);
    }
});

