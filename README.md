## DDP Server

DDP-Server is a nodejs based DDP Server.

Usage,

```js
var DDPServer = require('ddp-server');
var ddp = new DDPServer({});

ddp.methods({
    test: function() {
        return true;
    }
});


ddp.listen(4000);
```

Optionally, server could be passed as parameter,

```js
var http = require('http');
var DDPServer = require('ddp-server');

var server = http.createServer();
var ddp = new DDPServer({server: server});

// define methods...

server.listen(400);
```

You can then connect to it using a ddp client such as `ddp`.
