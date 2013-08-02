define([
	'jquery',
	'backbone',
	'marionette',
	'app/app',
	'app/entities/_base/collection',
	'app/entities/_base/model'
	], function(jQuery, Backbone,  Marionette, App){
		
		var UserModel = App.Entities.Model.extend({});
		var UserCollection = App.Entities.Collection.extend({
			model: UserModel
		});

		var API = {

			getUserById: function(id){
				var deferred = $.Deferred();
				this._getUserById(id, deferred);
				return deferred.promise();
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
							ajax: ajax,
							model: new UserModel(data)
						})
					}
				})

			}

		}

		App.reqres.setHandler('user:getById', function(id){
			return API.getUserById( id );
		})

})