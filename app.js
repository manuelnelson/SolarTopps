/**
 * Created by elnel_000 on 6/1/2014.
 */
var forever = require('forever-monitor');

var child = new (forever.Monitor)('keystone.js', {
    max: 3,
    silent: false,
    options: []
});

child.on('exit', function () {
    console.log('keystone.js has exited after 3 restarts');
});

child.start();