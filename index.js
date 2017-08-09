const nodeinfo = require('./lib'),
      bitcoin = require('bitcoin'),
      config = require('./config.json');

var node = null;

function init() {
    node = new bitcoin.Client(config.node);

   nodeinfo.server.start(config.server.port, node);
}


(function () {
    init();
})()
