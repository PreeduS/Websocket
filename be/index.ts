const result = require('dotenv').config()
import express from 'express';
import bootstrap from './bootstrap';
import wsServer from './chat/index';

if (result.error) {
    throw result.error
}
//const http = require('http');
//const hserver = http.createServer();
const app = express();
const port = process.env.PORT || 5000;

console.log('process.env.NODE_ENV : ',process.env.NODE_ENV)

bootstrap(app)

const httpServer = app.listen(port, () => console.log('Server started..'))
//const httpServer = hserver.listen(port, () => console.log('Server started..'))
httpServer.on('upgrade',((request, socket, head)=>{
        //console.log('upgrade', request)

        wsServer.handleUpgrade(request, socket, head, function done(ws) {
            wsServer.emit('connection', ws, request, );
          });
}))

