var socket = io();
var container = document.getElementById('globe');
var globe = new DAT.Globe(container);
var right = document.getElementById('rightside');
var left = document.getElementById('leftside');

socket.on('peerLoc', function(data) {
    var countryContainer = document.createElement('div')
    countryContainer.setAttribute('id', 'country');

    var country   = [];
    var countries = {};

    for (var i = 0; i < data.length; i++) {
        var split = data[i].loc.split(',');
        globe.addData(split, {format: 'magnitude'});
        globe.createPoints();
    }

    globe.animate();

    for (var i = 0; i < data.length; i++) {
        country.push(data[i].country)
    }

    append(country, countries, data, countryContainer)
    right.replaceChild(countryContainer, document.getElementById('country'));
});

socket.on('peerInfo', function(data) {
    var peerContainer = document.createElement('div');
    peerContainer.setAttribute('id', 'peers');

    var tableContainer = document.getElementById('table')
    var table = document.createElement('tbody')
    table.setAttribute('id', 'tbody');

    var subver = [];
    var subvers = {};

    for (var i = 0; i < data.length; i++) {
        subver.push(data[i].subver)
    }

    append(subver, subvers, data, peerContainer);

    for (var i = 0; i < data.length; i++) {   //TODO, CLEAN THIS UP
        var tr = document.createElement('tr');

        var ip = document.createElement('td');
        var blockheight = document.createElement('td');
        var ping = document.createElement('td');
        var version = document.createElement('td');
        var subversion = document.createElement('td');

        ip.innerHTML = data[i].addr;
        ping.innerHTML = data[i].pingtime;
        version.innerHTML = data[i].version;
        subversion.innerHTML = data[i].subver;
        blockheight.innerHTML = data[i].synced_blocks;

        tr.append(ip);
        tr.append(ping);
        tr.append(version);
        tr.append(subversion);
        tr.append(blockheight);

        table.append(tr);
    }

    tableContainer.replaceChild(table, document.getElementById('tbody'));
    right.replaceChild(peerContainer, document.getElementById('peers'));
});

$('#slide').on('click', function() {
    if ($('#leftside').css('left') =='0px') {
        $('#leftside').animate({left: '-100%'}, 1000);
    } else {
        $('#leftside').animate({left: '0'}, 1000);
    }
});

function append(arr, obj, data, container) {
    arr.forEach(function(x) {
        obj[x] = (obj[x] || 0)+1;
    });

    for (key in obj) {
        container.append(document.createTextNode(key + '- ' + obj[key]))
        container.append(document.createElement('br'))
    }
}
