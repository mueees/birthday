define([
    'backbone',
    'text!../templates/pm_usersTabs.html',
    '../subViews/addNewUser/views/index',
    'plugins/overlay/views/overlay',
    '../collections/users',
    '../subViews/userView/views/index',
    '../subViews/editUser/views/index',
    'plugins/notice/notice',
    'plugins/preload/views/preload',
    'icheck'
], function(
    Backbone,
    templateView,
    AddNewUserPopUp,
    overlay,
    UsersCollection,
    UserView,
    EditUserView,
    NoticeFactory,
    preload
    ){
    return Backbone.View.extend({

        tagName: "div",

        id: "usersTab",

        template: _.template( templateView ),

        events: {
            "click .controlSection .addNewUser": "showPopUpAddNewUser"
        },
        userRole: /*ZEOINSIGHT.config.user.role || "user"*/ null,


        newUserData: null,

        /*
            Initialize application
         */
        initialize: function( options ){

            var _this = this;

            _.bindAll(this, "addNewUserSuccess");
            _.bindAll(this, "addNewUserError");
            _.bindAll(this, "redirectToProjectsPage");

            this.model = options.model;
            this.parent = options.parent;
            this.deferred = options.deferred;
            this.userRole = this.model.get("role");
            /*
                Bind to change on devices
            */

            this.usersCollection = new UsersCollection({
                idProduct: this.model.get("id")
            });
            this.listenTo( this.usersCollection, "reset", this.render );
            this.listenTo( this.usersCollection, "add", this.renderOneUser );

            this.usersCollection.fetch({
                type: "POST",
                data: JSON.stringify({}),
                reset: true,
                error: _this.redirectToProjectsPage
            });
        },

        render: function(){

            /*
             Render Index View
             */
            var _this = this;
            var view = this.template({
                userRole: _this.userRole
            });
            this.$el.html(view);

            /*
               Add row Table to index View
            */
            this.usersCollection.each(function(model){
                _this.renderOneUser( model );
            });
            this.deferred.resolve();
            return this;

        },

        renderOneUser: function( model ){
            var _this = this;

            var user = new UserView({
                model: model,
                productId: _this.model.get("id"),
                userRole:  _this.userRole
            });

            this.listenTo(user, "editUser", function(userModel){
                var editUserView = new EditUserView({model: userModel});
                _this.listenTo(editUserView, "editUser", _this.editUser);
                editUserView.showPopUp();
            })

            this.$el.find('tbody').append( user.$el );
        },

        /*
            Show pop Up add New User
        */
        showPopUpAddNewUser: function(e){
            e.preventDefault();
            var addNewUser = new AddNewUserPopUp();
            this.listenTo(addNewUser, "addNewUser", this.addNewUser);
            addNewUser.showPopUp();
        },

        editUser: function(editData){
            var _this = this;
            preload.show();

            var data = {
                email: editData.model.get('email'),
                role: editData.role
            }

            $.ajax({
                type: "POST",
                url: "/api/product/" + _this.model.get("id") + "/edit_role",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(){
                    editData.model.set('roles', editData.role);
                    preload.hide();
                },
                error: function(){
                    preload.hidePreloadCircle();
                    var noticeView = NoticeFactory.factory({
                        type: "fill",
                        status: "alert",
                        icon: "alertColor",
                        title: "Error",
                        text: "Cannot edit user",
                        btnText: "Ok"
                    });
                    noticeView.showPopUp();
                }
            })
        },

        addNewUser: function(data){
            var _this = this;

            preload.show();
            $.ajax({
                type: "POST",
                url: "/api/product/" + _this.model.get("id") + "/set_role",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: _this.addNewUserSuccess,
                error: _this.addNewUserError
            })

            this.newUserData = data;
        },

        addNewUserSuccess: function(){
            this.usersCollection.add({
                email: this.newUserData.email,
                roles: this.newUserData.role
            });
            preload.hide();
        },

        addNewUserError: function(xhr){

            var errorArray, responseText, errorText;

            try{
                responseText = JSON.parse(xhr.responseText)
            }catch(e){
                responseText = null
            }

            if( responseText && ("errors" in responseText) ){
                errorArray = this.parseError(responseText);
            }else{
                errorArray = ['New user has not been created due to the server error. Please try again later.']
            }

            errorText = errorArray.slice("\n");

            preload.hidePreloadCircle();
            var noticeView = NoticeFactory.factory({
                type: "fill",
                status: "alert",
                icon: "alertColor",
                title: "Error",
                text: errorText,
                btnText: "Ok"
            });
            noticeView.showPopUp();
        },

        close: function(){
            this.remove();
            this.stopListening();
        },

        parseError: function(errors){
            var error;
            var result = [];
            for( error in errors ){
                if( typeof errors[error] == "object"){
                    var res = this.parseError(errors[error]);
                    result = result.concat(res);
                }else if( typeof errors[error] == "string" ){
                    result.push(errors[error]);
                }
            }
            return result;
        },

        redirectToProjectsPage: function(){
            window.location.hash = "#";
        }

    });
})