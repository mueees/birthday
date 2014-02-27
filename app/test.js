var request = require('request');

var options = {
    url: 'http://localhost:56899/authorize/test',
    type: 'get',
    headers: {
        Authorization : ' Bearer NviMo5nTdFF6l7eBhUzxyGr/49/qf3/flThGx1VJguA='
    }
};

function callback(error, response, body) {

    console.log(body);
}

request(options, callback);