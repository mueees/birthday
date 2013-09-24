var _ = require('underscore'),
    path = require('path'),
    config = require('config');


var root = config.get('publicDir');

function Utility(){}
_.extend(Utility, {

    normalize: function( value ){
        value = path.normalize(value);
        return Utility.clearLastSlash(value);

    },

    clearLastSlash: function(value){
        return value.replace(/\/$/, "");
    },

    clearRoot: function(filePath){
        return filePath.replace(root,"");
    }

})

module.exports = Utility;