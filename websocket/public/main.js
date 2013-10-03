


var sock = new SockJS('http://forge:56899/socket');
    var request = {
        id: 12,
        method: '/twitter/addListener',
        params: {}
    }

    sock.onopen = function() {
        sock.send( JSON.stringify(request) );
    };
    sock.onmessage = function(e) {
        console.log(e.data);
    };
    sock.onclose = function() {
        console.log('close');
    };