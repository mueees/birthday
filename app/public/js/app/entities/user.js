define([
    'jquery',
    'backbone',
    'marionette',
    'app/app',

    'app/collections/user/users',
    'app/models/user/user'
], function(jQuery, Backbone, Marionette, App, UserCollection, UserModel){

    var API = {

        getUserById: function(id){
            var deferred = $.Deferred();
            this._getUserById(id, deferred);
            return deferred.promise();
        },

        saveNewUser: function( data ){
            var user = new UserModel(data);
            var deferred = $.Deferred();

            user.save(null,{
                success: function(){
                    deferred.resolve({
                        model: user
                    })
                },
                error: function(model, xhr){
                    deferred.reject({
                        model: user,
                        xhr: xhr
                    })
                }
            });


            return deferred.promise();
        },

        getUsers: function( data ){
            var deferred = $.Deferred();
            this._getUsers( data, deffender );
            return 
        },

        _getUserById: function(id, deferred){
            var ajax = jQuery.ajax({
                url: App.config.api.remove,
                type: 'GET',
                success: function(data){
                    deferred.resolve({
                        data: data,
                        ajax: ajax,
                        model: new UserModel(data)
                    })
                },
                error: function(data){
                    deferred.reject({
                        data: data,
                        ajax: ajax
                    })
                }
            })

        }

    }

    App.reqres.setHandler('user:getById', function(id){
        return API.getUserById( id );
    })

    App.reqres.setHandler('user:saveNewUser', function( data ){
        return API.saveNewUser( data );
    })

    App.reqres.setHandler('user:getUsers', function( data ){
        return API.getUsers( data );
    })

})