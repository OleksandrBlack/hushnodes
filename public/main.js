var xhr = new XMLHttpRequest();

var container = document.getElementById('globe');
var globe = new DAT.Globe(container);
var peerContainer = document.getElementById('peer');
var countryContainer = document.getElementById('country');
var table = document.getElementById('tablebody');

console.log(table)

function peerloc(cback) {
    xhr.open('GET', 'peerLoc', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var country   = [];
            var countries = {};

            for (var i = 0; i < data.length; i++) {
                globe.addData(data[i].loc, {
                    format: 'magnitude',
                    name: data[i].ip
                });

                globe.createPoints();
                globe.animate();
            }

            for (var i = 0; i < data.length; i++) {
                country.push(data[i].country)
            }

            append(country, countries, data, countryContainer)

            var pnodes = document.getElementById('nodes')
            pnodes.innerHTML = "Currently connected to " + data.length + " nodes.";
            
            cback();
        }
    };
    xhr.send( null );
}

function peerinfo() {
    xhr.open('GET', 'peerInfo', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            var subver    = [];
            var subvers   = {};

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
                blockheight.innerHTML = data[i].startingheight;

                tr.append(ip);
                tr.append(ping);
                tr.append(version);
                tr.append(subversion);
                tr.append(blockheight);

                table.append(tr);
            }
        }
    }
    xhr.send( null );
}

function append(arr, obj, data, container) {
    arr.forEach(function(x) {
        obj[x] = (obj[x] || 0)+1;
    });

    for (key in obj) {
        container.append(document.createTextNode(key + '- ' + obj[key]))
        container.append(document.createElement('br'))
    }
}

peerloc(peerinfo);
