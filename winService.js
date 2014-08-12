var Service = require('node-windows').Service;

 // Create a new service object
 var svc = new Service({
   name:'SolarTopps',
   description: 'ST',
   script: 'C:\\Mine\\Development\\SolarTopps\\app.js',
   //script: 'app.js',
   env: [{name:"CLOUDINARY_URL",value:"cloudinary://823293942824313:1Aa86RqCheaTJTu32jxCNcF1Iyo@solartopps"},
{name:"MANDRILL_API_KEY",value:"pp0NgvhnNBw4k6sOXXELrg"},
{name:"MANDRILL_USERNAME",value:"robby@solartopps.com"},
{name:"MONGOLAB_URI",value:"mongodb://heroku_app25105627:rk38e037pjn9bit5vhvv58cfdc@ds043037.mongolab.com:43037/heroku_app25105627"}]
});

 // Listen for the "install" event, which indicates the
 // process is available as a service.
 svc.on('install',function(){
   svc.start();
 });

 svc.uninstall();