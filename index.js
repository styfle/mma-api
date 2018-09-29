const { createServer } = require('http');
const { parse } = require('url');
const { fighter } = require("mma");

const hostname = '127.0.0.1';
const port = 3000;

let cache = new Map();

const server = createServer((req, res) => {
    let { httpVersion, method, url } = req;
    console.log(`${httpVersion} ${method} ${url}`);
    let { query = {} } = parse(url || '', true);

    if (!query.fighter) {
        const data = { error: 'Fighter Not Found' };
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, ' '));
        return;
    }

    if (cache.has(query.fighter)) {
        const data = cache.get(query.fighter);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, ' '));
        return;
    }

    fighter(query.fighter, data => {
        cache.set(query.fighter, data);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data, null, ' '));
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

