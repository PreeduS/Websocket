const express = require('express');
const app = express();
const port = 5000;

// ws
const WebSocket = require('ws');
const server = WebSocket.Server;
const wsServer = new server({
    port: 5001
})

/*
app.use('/',(req,res,next)=>{
    console.log('req.ws ',req.ws)
    wsServer.on('connection', (ws) => {
        console.log('conn')
        req.ws = ws;
        next()
    })
})*/

// temp code

const users = []

app.get('/users/add', (req, res) => {
    const newUser = {
        id: users.length,
        name: `placeholder ${users.length}`       
    }
    users.push(newUser)

    //wsServer.on('connection', (ws) => {
        /*req.ws.send(JSON.stringify({
            type: 'user',
            data: newUser
        }))*/
    //})
    res.send('Added')
})



wsServer.on('connection', (ws) => {
    //ws.id = Math.random();  // or token
    console.log('connection ',ws.message)
    ws.on('message',(message) => {
        // console.log('message: ',message)

        //ws.send('self: '+ message)
        const { data, type } = JSON.parse(message)

        if(type === 'add_user'){
            console.log('add user ',data)
        }else{
            wsServer.clients.forEach(client => {
                //    console.log('client ',client)
         
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type,//: 'comment',
                            data//: message
                      
                        }));
                    }
            })
        }
            


    })
})

app.listen(port, () => console.log('Server started'))