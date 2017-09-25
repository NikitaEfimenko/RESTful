'use strict';
var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            var body = items.map(function (it, i) { return '\t' + i + ' )' + it }).join('\n');
            console.log(body);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.statusCode = 200;
            res.end(body);
            break;
        case "POST":
            var elem = "";
            req.on('data', function (chunk) {
                elem += chunk;
            })
            req.on('end', function () {
                items.push(elem);
                res.end("OK\n");
            });
            break;
        case "DELETE":
            var elem = parseInt(url.parse(req.url).pathname.slice(1));
            if (isNaN(elem)) {
                res.statusCode = 403;
                res.end("secure Error");
            }
            else if (!items[elem]) {
                res.statusCode = 404;
                res.end("not Exist");
            }
            else {
                items.splice(elem, 1);
                res.statusCode = 200;
                res.end("OK\n");
            }
            break;
        case "PUT":
            break;
    }

    }).listen(3000);
