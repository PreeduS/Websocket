import * as JWT from 'jsonwebtoken'
/*
const jwt = {
    secret: 'secret'
}
*/
 
type Options = {
    expiresIn: string
}

type SignToken = (payload: object, secret: string, options?: Options ) => string;

const defaultOptions: Options = {
    expiresIn: '15s'
}

const signToken:SignToken = (payload, secret, options = defaultOptions) => {
    const token = JWT.sign(
        //iat: new Date().getTime()
       payload
    //, jwt.secret, { expiresIn: '1h' });
    , secret, options);

    return token;
}

export const verifyToken = (token, secret) => {
    const result = JWT.verify(token, secret)
    /*const result = new Promise((resolve, reject) => {
        JWT.verify(token, secret, function(err, decoded) {
            if(err){
                
                resolve({valid:false})
            }else{
                resolve({valid:true, decoded})
            }

          });
    })*/
    
 
    return result
}

export default signToken;