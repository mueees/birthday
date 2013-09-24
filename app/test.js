var execFile = require('child_process').execFile;

execFile('zip', ['-r', "test.zip", './action'], function(err, stdout) {
    if(err) {
        console.log(err);
        return false;
    }
});