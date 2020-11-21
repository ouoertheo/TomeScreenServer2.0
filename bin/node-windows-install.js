// https://github.com/coreybutler/node-windows

var Service = require('node-windows').Service;

var svc = new Service({
    name:'TomeScreenServer',
    description: 'Runs Node.js server to receive API calls from TomeScreenClient',
    script: require('path').join(__dirname,'server.js'),
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ]
});

svc.on('install',function(){
    svc.start();
});

svc.install();
