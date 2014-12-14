var server = new DDPServer({});

server.methods({
    test: function(a, b) {
        console.log(a, b);
    }
})

server.listen(13000);