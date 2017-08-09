const express = require('express');
const request = require('request');
const bitcoin = require('bitcoin');
const config = require('./config');
const url = require('url');

const app = express();
const node = new bitcoin.Client(config.node);

var peerInfo = null;
var peerLoc = null;
var info = null;

function getInfo(next) {
    node.cmd('getpeerinfo', (err, res, resHeaders) => {
        if (err) throw err

        peerInfo = res;

        if (next)
            getLoc(res);
    });

    node.cmd('getinfo', (err, res, resHeaders) => {
        if (err) throw err;

        info = res;
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

                if (count > total - 1)
                    peerLoc = arr;
            });
        })(peer);
    }
}

function start(port) {
    getInfo(node, true);

    setInterval(getInfo, 5000, false);

    setInterval(getLoc, 600000, peerInfo);

    app.use('/', express.static('public'));

    app.get('/nodeInfo', (request, response) => {
        response.send(info);
    });

    app.get('/peerInfo', (request, response) => {
        response.send(peerInfo);
    });

    app.get('/peerLoc', (request, response) => {
        response.send(peerLoc);
    });

    app.listen(port, function () {
        console.log ('Server listening on port %s', port);
    });
};

start(config.server.port);
