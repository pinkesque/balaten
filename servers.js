

export let servers = [];

export function serverSearch() {
    return servers
}

export function createServer(server) {
    servers.push({
        name: server.servername,
        id: servers.length,
        options: server.options
    });
}