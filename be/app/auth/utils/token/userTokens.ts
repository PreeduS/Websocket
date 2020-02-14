import signToken, { verifyToken } from './signToken';
import { UserJwtPayload, User } from 'app/common/types/user';

type Options = {
    expiresIn: string
}

// type SignToken = (payload: object, options?: Options ) => string;

const jwt = {
    secretAccess: 'secret',
    secretRefresh: 'secret2'
}



export const signAccessToken = ({username}: User, options?: Options) => {
    const payload: UserJwtPayload = {
        user: { username }
    }
    const token = signToken(payload, jwt.secretAccess, options)
    return token
}

const defaultRefreshOptions: Options = {
    expiresIn: '2h'
}
export const signRefreshToken = ({username}: User, options: Options = defaultRefreshOptions) => {
    const payload: UserJwtPayload = {
        user: { username }
    }
    const token = signToken(payload, jwt.secretRefresh, options)
    return token
}



export const verifyAccessToken = (token) => {
    const result = verifyToken(token, jwt.secretAccess)
    return result as UserJwtPayload | Error;
}
export const verifyRefreshToken = (token) => {
    const result = verifyToken(token, jwt.secretRefresh)
    return result as UserJwtPayload | Error;
}