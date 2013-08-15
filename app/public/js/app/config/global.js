define([], function(){

	return {

		api:{

            user: '/api/user',
            getUsers: '/api/users',
            getCountUsers: '/api/users/count',
            getOneUser: '/api/user/get',

			//не работают
            deleteUser: '/api/user/deleteUser',
            changeUser: '/api/user/change',
            addUser: '/api/user/add'

		},

		chanels: {
			main: {
                searchFilterChanged: "searchFilterChanged"
            }
		}

	}

})