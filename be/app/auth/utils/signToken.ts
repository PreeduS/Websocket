import * as JWT from 'jsonwebtoken'

const jwt = {
    secret: 'secret'
}

const signToken = (payload: object) => {
    const token = JWT.sign(
        //iat: new Date().getTime()
       payload
    //, jwt.secret, { expiresIn: '1h' });
    , jwt.secret, { expiresIn: '15s' });

    return token;
}


export default signToken;