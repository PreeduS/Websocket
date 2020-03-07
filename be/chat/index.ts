import WebSocket from 'ws';
import { verifyRefreshToken } from 'app/auth/utils/token/userTokens';
import { UserJwtPayload } from 'app/common/types/user';
import commentService from 'app/services/comment'



const wsServer = new WebSocket.Server({
   // port: 5001
    noServer: true
})


const messageType = {
    auth: 'auth',
    user: 'user',
    comment: 'comment',
}

const userType = {
    signIn: 'signIn',
    signOut: 'signOut',
    getUsers: 'getUsers',
}


wsServer.on('connection', async (ws, request, client) => {
    //ws.id = Math.random();  // or token
    ws.authenticated = false;
    ws.user = {}
    console.log('connection ... ', Array.from(wsServer.clients).filter((x:any) =>  x.user.username).map((x:any) => (x.user.username + ', ')) )


    //temp
    const comments = await commentService.find();

console.log('comments', comments)
    wsServer.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {


            comments.forEach(x => {
                client.send(JSON.stringify({
                    type: messageType.comment,
                    data: {
                        comment: x.comment,
                        username: x.user.username
                    }
                }));
            })
            // send comments
            //if(type === messageType.comment){

           // }

        }
    })


// ------------_ tmp
/*
setInterval(()=>{
    wsServer.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
    
    
           
                client.send(JSON.stringify({
                    type: messageType.comment,
                    data: {
                        comment: 'comment '+Date.now(),
                        username: 'x.user.username'
                    }
                }));
           
            // send comments
            //if(type === messageType.comment){
    
           // }
    
        }
    })
},800)
*/

// ------------_ tmp




    // send all signedIn users
    ws.send(JSON.stringify({
        type: messageType.user,
        data: {
            users: Array.from(wsServer.clients).filter((x:any) =>  x.user.username).map((x:any) => ({
                username:x.user.username,
                //duplicate:x.user.duplicate,

            })),
            type: userType.getUsers,
        }
    }));


    ws.on('close', function close(e) {
        console.log('---- 2-disconnected ',e, ws.user);

   /*     const sameSessions = Array.from(wsServer.clients).filter((x:any) =>  x.user.username === ws.user.username)

        console.log('close ',Array.from(wsServer.clients).filter((x:any) =>  x.user.username === ws.user.username).map((x:any) => ({
            username:x.user.username,

        })))*/

        // send user signOut
        wsServer.clients.forEach((client: any) => {
            if (client.readyState === WebSocket.OPEN ) {
                client.send(JSON.stringify({
                    type: messageType.user,
                    data: {
                        username: ws.user.username,
                        type: userType.signOut
                    }
                }));
            }
        })

    });
    
    ws.on('message', (message: any) => {
         console.log('message: ',message, ws.authenticated)
        const { data, type } = JSON.parse(message)
        
        if(!ws.authenticated && type === messageType.auth){
            //const accessToken = data.accessToken
            const refreshToken = data.refreshToken;

            try{
                const refreshTokenPayload = verifyRefreshToken(refreshToken) as UserJwtPayload;
                const { username } = refreshTokenPayload.user;
               // const alreadyExists = Array.from(wsServer.clients).find((x:any) => x.user.username === username) !== undefined;
              //  console.log('here ---------- refreshToken',refreshToken, username)
                ws.authenticated = true;
                ws.user = {
                    username,
                   // duplicate: alreadyExists
                }

                // send all signedIn users
               /* ws.send(JSON.stringify({
                    type: messageType.user,
                    data: {
                        users: Array.from(wsServer.clients).filter((x:any) => x.user.username !== username && x.user.username).map((x:any) => ({username:x.user.username})),
                        type: userType.getUsers
                    }
                }));*/

                ws.send(JSON.stringify({
                    type: messageType.auth,
                    data: {
                        authenticated: true,
                        user: refreshTokenPayload.user
                    }
                
                }));
                
                // send user signIn
                wsServer.clients.forEach((client: any) => {
                    if (client.readyState === WebSocket.OPEN ) {
                        client.send(JSON.stringify({
                            type: messageType.user,
                            data: {
                                username,
                                type: userType.signIn
                            }
                        }));

                    }
                })




            }catch(e){
                // on expired
                ws.authenticated = false
                ws.user = {}
                ws.send(JSON.stringify({
                    type: messageType.auth,
                    data: {
                        authenticated: false
                    }
              
                }));
/*
                // send all signedIn users
                ws.send(JSON.stringify({
                    type: messageType.user,
                    data: {
                        users: Array.from(wsServer.clients).filter((x:any) =>  x.user.username).map((x:any) => ({username:x.user.username})),
                        type: userType.getUsers
                    }
                }));
*/
                ws.close()
            }


        }else if(ws.authenticated){

            wsServer.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN) {

                    // send comments
                    if(type === messageType.comment){
                        client.send(JSON.stringify({
                            type,
                            data: {
                                comment: data.comment,
                                username: ws.user.username
                            }
                        }));

                        commentService.insert({ comment: data.comment })
                    }

                }
            })
        
            
        }else{
            ws.close()
        }
            


    })
})


export default wsServer;