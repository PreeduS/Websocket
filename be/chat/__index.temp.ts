import WebSocket from 'ws';
import { verifyRefreshToken } from 'app/auth/utils/token/userTokens';
import { UserJwtPayload } from 'app/common/types/user';


// ws
const server = WebSocket.Server;
const wsServer = new server({
   // port: 5001
    noServer: true
})

// temp code
/*
const users = []

app.get('/users/add', (req, res) => {
    const newUser = {
        id: users.length,
        name: `placeholder ${users.length}`       
    }
    users.push(newUser)

    //wsServer.on('connection', (ws) => {
        //req.ws.send(JSON.stringify({
        //    type: 'user',
        //    data: newUser
        //}))
    //})
    res.send('Added')
})
*/




wsServer.on('connection', (ws, request, client) => {
    //ws.id = Math.random();  // or token
    console.log('connection ...', )
    ws.authenticated = false;
    ws.user = {}
    /*if(Math.random() < .5){
        ws.close()
        console.log('connection closed')
    }*/
    ws.on('close', function close(e) {
        console.log('---- 2-disconnected ',e, ws.user);
        // todo push logout
    });
    
    ws.on('message', (message: any) => {
        
        // console.log('message: ',message)


        //ws.send('self: '+ message)
        const { data, type } = JSON.parse(message)

       // console.log('self ws.authenticated', ws.authenticated)


        if(!ws.authenticated && type === 'auth'){
            //const accessToken = data.accessToken
            const refreshToken = data.refreshToken;



            try{
                const refreshTokenPayload = verifyRefreshToken(refreshToken) as UserJwtPayload;
                const { username } = refreshTokenPayload.user



                //const alreadyExists = Array.from(wsServer.clients).find((x:any) => x.user.username === username) !== undefined;
                console.log('auth username ', username)
                //console.log('Array.from(wsServer.clients) ', Array.from(wsServer.clients).map((x : any) => x.user))

           
                /*if( false && alreadyExists ){
                    ws.authenticated = false;
                    ws.user = {};

                    ws.send(JSON.stringify({
                        type: 'auth',
                        data: {
                            authenticated: false,
                            type: 'AlreadyExistsError'
                        }
                  
                    }));
                }else {*/
                ws.authenticated = true;
                ws.user = {
                    username
                }
                ws.send(JSON.stringify({
                    type: 'auth',
                    data: {
                        authenticated: true,
                        user: refreshTokenPayload.user
                    }
                
                }));

                wsServer.clients.forEach((client: any) => {

                        if (client.readyState === WebSocket.OPEN ) {
                            client.send(JSON.stringify({
                                type: 'user',
                                data: {
                                    username
                                }
                          
                            }));
   
                        }
                })




            }catch(e){
                // on expired
                ws.authenticated = false
                ws.user = {}
                ws.send(JSON.stringify({
                    type: 'auth',
                    data: {
                        authenticated: false
                    }
              
                }));
                ws.close()
            }


        }else if(ws.authenticated){

            if(type === 'add_user'){
                console.log('add user ',data)
            }else{
                wsServer.clients.forEach((client: any) => {
                    //    console.log('client ',client)


    
                        if (client.readyState === WebSocket.OPEN) {

                            if(type === 'comment'){
                                client.send(JSON.stringify({
                                    type,

                                    data: {
                                        comment: data.comment,
                                        //username: data.username,
                                        username: ws.user.username
                                    }
                              
                                }));
                            }/*else{
                                client.send(JSON.stringify({
                                    type,//: 'comment',
                                    //data//: message
                                    data//: data + (client ===ws ? ' self ':'')//: message
                              
                                }));
                            }*/

                        }
                })
            }
            
        }else{
            //ws.close()
        }
            


    })
})

/*
app.on('upgrade',(request, socket, head) => {
    console.log('upgrade ',request)
})
*/

export default wsServer;