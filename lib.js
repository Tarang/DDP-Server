var DDPServer = function(opts) {

    var WebSocket = require('faye-websocket'),
        http = require('http'),
        _ = require('underscore'),
        server = opts.server || http.createServer(),
        methods = {},
        self = this;

    if (opts.methods) _.extend(methods, opts.methods);

    server.on('upgrade', function(request, socket, body) {
        function sendMessage(data) {
            ws.send(JSON.stringify(data));
        }

        if (WebSocket.isWebSocket(request)) {
            var ws = new WebSocket(request, socket, body);
            var session_id = new Date().getTime();

            ws.on('message', function(event) {
                var data = JSON.parse(event.data);

                switch (data.msg) {
                    case "connect":
                        {
                            sendMessage({
                                server_id: 0
                            });

                            sendMessage({
                                msg: "connected",
                                session_id: session_id
                            });

                            break;
                        }

                    case "method":
                        {
                            if (data.method in methods) {
                                try {
                                    var result = methods[data.method].apply(this, data.params);

                                    sendMessage({
                                        result: result,
                                        id: data.id,
                                        msg: "result"
                                    });
                                } catch (e) {
                                    sendMessage({
                                        id: data.id,
                                        error: {
                                            error: 500,
                                            reason: "Internal Server Error",
                                            errorType: "Meteor.Error"
                                        }
                                    });
                                }
                            } else {
                                console.log("Error method " + data.method + " not found");

                                sendMessage({
                                    id: data.id,
                                    error: {
                                        error: 404,
                                        reason: "Methd not found",
                                        errorType: "Meteor.Error"
                                    }
                                });
                            }

                            break;
                        }

                    default:
                        {

                        }
                }
            });

            ws.on('close', function(event) {
                console.log('close', event.code, event.reason);
                ws = null;
                session_id = null;
            });
        }
    });

    this.listen = function(port) {
        // assumed that .listen() should be called outside, if server is passed in options
        if (opts.server) {
            return;
        }

        server.listen(port);
    };

    this.methods = function(newMethods) {
        for (var key in newMethods) {
            if (key in methods) throw new Error(500, "A method named " + key + " already exists");
        }

        _.extend(methods, newMethods);
    };
};

module.exports = DDPServer;
