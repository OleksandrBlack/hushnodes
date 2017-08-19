const express = require('express');
const request = require('request');
const bitcoin = require('bitcoin');
const config = require('./config');
const async = require('async');
const url = require('url');

const app = express();
const node = new bitcoin.Client(config.node);
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Since this is refreshed every hour, make it a global
var peerLoc = null;

function getInfo(next) {
    node.cmd('getpeerinfo', (err, res, resHeaders) => {
        if (err) throw err

        io.emit('peerInfo', res);

        if (next)
            getLoc(res);
    });
}

function getLoc(peerData) {
    var arr = [];
    var total = peerData.length;
    var count = 0;

    for (var peer in peerData) {
        (function(index) {
            request('http://ipinfo.io/' + url.parse('http://'+peerData[peer].addr).hostname, (err, res, body) => {
                if (err) callback(err);

                body = JSON.parse(body);
                if (body.loc) {
                    var arr2 = body.loc.split(',');
                    arr2.push('0.2');
                    body.loc = arr2;
                } else {
                    body.loc = '1,1,0.2';
                    body.country = 'unknown';
                }

                arr.push(body)
                count++;

                if (count > total - 1) {
                    peerLoc = arr;
                    io.emit('peerLoc', arr);
                }
            });
        })(peer);
    }
}

function start(port) {
    getInfo(node, true);

    setInterval(getInfo, 200, false);

    const delayed  = function () {
        getLoc(peerInfo);
    };

    setInterval(delayed, 3600000);

    app.use('/', express.static('public'));

    /*app.get('/peerInfo', (request, response) => {
        response.send(peerInfo);
    });

    app.get('/peerLoc', (request, response) => {
        response.send(peerLoc);
    });*/

    io.on('connection', function(socket) {
        console.log('Connection!!! %s', socket.id);
        io.emit('peerLoc', peerLoc);
    });

    server.listen(port);
};


start(config.server.port);
