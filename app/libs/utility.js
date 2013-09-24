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

    normalizeArray: function( paths ){
        var result = [];
        _.each(paths, function(path, i){
            result.push( Utility.normalize(path) );
        })
        return result;
    },

    clearLastSlash: function(value){
        //return ( value.length > 1 ) ? value.replace(/\/$/, "") : value;
        return value.replace(/\/$/, "");
    },

    clearRoot: function(filePath){
        return filePath.replace(root,"");
    },

    clearEmptyString: function( array ){
        var isArray =_.isArray(array);
        var result = [];

        if(!isArray) return false;

        _.each(array, function(item){
            if (item !== "") result.push(item);
        })

        return array;
    },

    addRootToPath: function(pathItem){

        var isArray =_.isArray(pathItem),
            result = [];

        if(isArray){
            _.each(pathItem, function(currentPath){
                result.push( root + currentPath );
            })
            return result;
        }else{
            return root + pathItem;
        }
    }

})

module.exports = Utility;