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
            addUser: '/api/user/add',

            /*event*/
            event: '/api/event',
            getEventToShow: "/api/event/getEventToShow"

        },

        eventName: {
            main: {
                searchFilterChanged: "searchFilterChanged",
                tabEventChanged: "tabEventChanged",
                calendarChanged: "calendarChanged",
                changeEvent: "changeEvent"
            }
        }

    }

})