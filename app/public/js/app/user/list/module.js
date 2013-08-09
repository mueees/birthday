define([
    'app/app',
    './list_layout',
    
    '../search/module',
    '../users_list/module'
], function(App, Layout){

    App.module("User.List", {
        startWithParent: false,

        define: function(List, App, Backbone, Marionette, $, _){

			List.Controller = {
				showUsers: function(){

					//get Layout
					var layout = new Layout();
                    layout.render();

                    //append layout to DOM
                    App.main.show( layout );          

					//append search view
                    App.User.Search.Api.display( layout.search )

                    //append users to layout
                    App.User.Users_list.Api.display( layout.users )


				}
			}


        }
    })

})