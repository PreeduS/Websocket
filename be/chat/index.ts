import WebSocket from 'ws';
import { verifyRefreshToken } from 'app/auth/utils/token/userTokens';
import { UserJwtPayload } from 'app/common/types/user';
import commentService from 'app/services/comment';

import { 
    getUser, 
    getUsers, 
    getComment, 
    getComments,
    getAuth,
    userType,
    messageType
} from './getMessages'

const wsServer = new WebSocket.Server({
    // port: 5001
    noServer: true
})




wsServer.on('connection', async (ws, request, client) => {
    // ws.id = Math.random();  // or token
    ws.authenticated = false;
    ws.user = {}
    //  console.log('connection ... ', Array.from(wsServer.clients).filter((x:any) =>  x.user.username).map((x:any) => (x.user.username + ', ')) )

    //temp
    const comments = await commentService.find({limit: 100});
    // console.log('comments', comments)
    const updatedComments = getComments({ comments })
    ws.send(updatedComments);
    /*wsServer.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(updatedComments);

            //comments.forEach(x => {
                //client.send( getComment({ comment: x.comment, username: x.user.username }) );
            //})
        }
    })*/


// ------------_ tmp
/*
setInterval(()=>{
    wsServer.clients.forEach((client: any) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send( getComment({ comment:'comment '+Date.now(), username:'x.user.username' }) );
        }
    })
},800)
*/
// ------------_ tmp


    // send all signedIn users
    const users = Array.from(wsServer.clients).filter((x:any) =>  x.user.username).map((x:any) => ({
        username:x.user.username,
        //duplicate:x.user.duplicate,

    }))
    //ws.send( getUsers({userType: userType.getUsers, users}) )
    ws.send( getUsers({users}) )



    ws.on('close', function close(e) {
        //console.log('---- 2-disconnected ',e, ws.user);

   /*     const sameSessions = Array.from(wsServer.clients).filter((x:any) =>  x.user.username === ws.user.username)

        console.log('close ',Array.from(wsServer.clients).filter((x:any) =>  x.user.username === ws.user.username).map((x:any) => ({
            username:x.user.username,
        })))*/

        // send user signOut
        wsServer.clients.forEach((client: any) => {
            if (client.readyState === WebSocket.OPEN ) {
                client.send( getUser({userType: userType.signOut, username: ws.user.username}) );
            }
        })

    });
    
    ws.on('message', async (message: any) => {
        //console.log('message: ',message, ws.authenticated)
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
                ws.send( getAuth({authenticated: true, user: refreshTokenPayload.user}) );

                
                // send user signIn
                wsServer.clients.forEach((client: any) => {
                    if (client.readyState === WebSocket.OPEN ) {
                        client.send( getUser({userType: userType.signIn, username}) );
                    }
                })


            }catch(e){
                // on expired
                ws.authenticated = false
                ws.user = {}
                ws.send( getAuth({authenticated: false}) );
                ws.close()
            }


        }else if(ws.authenticated){


            try{
                await commentService.insertByUser({ comment: data.comment, username: ws.user.username })
                wsServer.clients.forEach((client: any) => {
                    if (client.readyState === WebSocket.OPEN) {
    
                        // send comments
                        if(type === messageType.comment){
                            client.send( getComment({ comment: data.comment, username: ws.user.username }) );
    
                            
                        }
    
                    }
                })
            }catch(error){}
        
            
        }else{
            ws.close()
        }            

    })
})


export default wsServer;