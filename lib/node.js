const bitcoin = require('bitcoin');

module.exports = { 
    connect: function (rpcConfig) {
        var client = new bitcoin.Client(rpcConfig);

        return client;
    },
    peerInfo: function (client) {
        client.cmd('getpeerinfo', function(err, res, resHeaders) {
            if (err != null)                                                
               throw err 

            return res;
        });
    },
    info: function (client) {
        client.cmd('getinfo', function(err, res, resHeaders) {
            if (err != null) 
                throw err

            return res;
        });
    }
};
