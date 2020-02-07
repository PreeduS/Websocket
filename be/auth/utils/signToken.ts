import * as JWT from 'jsonwebtoken'

const jwt = {
    secret: 'secret'
}

const signToken = (payload: any) => {
    const token = JWT.sign({
        //iat: new Date().getTime()
        user: payload
    }, jwt.secret, { expiresIn: '1h' });

    return token;
}


export default signToken;