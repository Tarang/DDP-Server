## DDP Server

DDP-Server is a nodejs based DDP Server.

Usage

```
var DDPServer = require("ddp-server");

DDPServer.methods({
    test: function() {
        return true;
    }
});


DDPServer.listen(4000);
```

You can then connect to it using a ddp client such as `ddp`