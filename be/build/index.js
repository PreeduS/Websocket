"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const app = express_1.default();
const port = process.env.PORT || 5000;
// ws
const server = ws_1.default.Server;
const wsServer = new server({
    port: 5001
});
// temp code
const users = [];
app.get('/users/add', (req, res) => {
    const newUser = {
        id: users.length,
        name: `placeholder ${users.length}`
    };
    users.push(newUser);
    //wsServer.on('connection', (ws) => {
    /*req.ws.send(JSON.stringify({
        type: 'user',
        data: newUser
    }))*/
    //})
    res.send('Added');
});
wsServer.on('connection', (ws) => {
    //ws.id = Math.random();  // or token
    //console.log('connection ',ws.message)
    ws.on('message', (message) => {
        // console.log('message: ',message)
        //ws.send('self: '+ message)
        const { data, type } = JSON.parse(message);
        if (type === 'add_user') {
            console.log('add user ', data);
        }
        else {
            wsServer.clients.forEach(client => {
                //    console.log('client ',client)
                if (client.readyState === ws_1.default.OPEN) {
                    client.send(JSON.stringify({
                        type,
                        data //: message
                    }));
                }
            });
        }
    });
});
app.get('/', (req, res) => {
    res.send('Added2.....');
});
app.listen(port, () => console.log('Server started..'));
//# sourceMappingURL=index.js.map