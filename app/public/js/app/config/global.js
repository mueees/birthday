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
            getEventToShow: "/api/event/getEventToShow",

            /*task*/
            task: '/api/task',
            getTasks: "api/getTasks", // получить все таски
            taskList: "/api/taskList", // CRUD одного листа
            getTaskList: "api/taskLists", //получить все листы с тасками,

            /*post*/
            post: "/api/post",
            getPosts:"/api/getPosts",

            /*preset*/
            preset: "/api/preset",
            getPresets:"/api/getPresets",

            /*fileBrowser*/
            defaultPath: "/img/blog/",
            fileBrowser: "/api/fileBrowser",
            newFolder: "/api/fileBrowser/newFolder",
            deleteItems: "/api/fileBrowser/deleteItems",
            downloadItems: "/api/fileBrowser/downloadItems",

            /*password*/
            login: "/api/login",
            logout: "/api/logout"


        },

        opts:{
            timeout: 1500
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