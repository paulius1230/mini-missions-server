const dgram = require('dgram');
const server = dgram.createSocket('udp4');

let clients = [];

server.on('message', (msg, rinfo) => {
    const message = msg.toString();
    const clientKey = rinfo.address + ':' + rinfo.port;

    // Add new client if not exists
    if (!clients.find(c => c.key === clientKey)) {
        clients.push({
            key: clientKey,
            address: rinfo.address,
            port: rinfo.port
        });
        console.log("New client:", clientKey);
    }

    console.log(`Received: ${message}`);

    // Broadcast to all other clients
    clients.forEach(client => {
        if (client.key !== clientKey) {
            server.send(msg, client.port, client.address);
        }
    });

    // Handle client disconnect after broadcasting
    if (message.startsWith("DISCONNECT|")) {
        console.log("Client disconnected:", clientKey);
        clients = clients.filter(c => c.key !== clientKey);
    }
});

server.bind(41234, () => {
    console.log('UDP server running on port 41234');
});
