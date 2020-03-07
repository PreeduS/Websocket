import bcrypt from 'bcrypt';
import { RequestHandler, Params } from 'app/common/types/express';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../auth/utils/token/userTokens';
import User from '../../app/mongoose/schema/user';
import verifyPassword from '../auth/utils/verifyPassword';
import { getGeneralError, type } from 'app/common/utls/getError';
import { UserJwtPayload } from 'app/common/types/user';

export type ReqBody = {
    username: string
    password: string
    email: string
}


class Auth {

     signIn = async (req, res) => {
        const { username, password } = req.body; 

        // get user from db
        let userResult;
        try {
            userResult = await User.findOne({username})
        }catch(e){
            return res.status(500).send(getGeneralError({type: type.InternalServerError}))
        }
    
        if(!userResult){
            return res.status(400).send(getGeneralError({message:'Wrong username or password'}))
        }
    
        // verify password
        const { password: hashPassword } = userResult;
        let passwordMatch;
        try {
            passwordMatch = await verifyPassword(password, hashPassword)
        }catch(error){
            return res.status(500).send(getGeneralError({type: type.InternalServerError}))
        }
        
        // sign and send tokens
        if(passwordMatch){
    
            const accessToken = signAccessToken({
                username,
            },{expiresIn: '15s'});
            const refreshToken = signRefreshToken({
                username
            });
    
            return res.status(200).send({accessToken, refreshToken})
        }else{
            return res.status(400).send(getGeneralError({message:'Wrong username or password'}))
        }
    
     
    }
    
    signUp: RequestHandler <Params, any, ReqBody> = async (req, res) => {

        const { username, password, email } = req.body;
        let userResult;
        // check if user is taken
        try {
            const result = await User.findOne({username});
            if(result){
                return res.status(409).send(getGeneralError({message: `${username} is taken`}))
            }
        }catch(e){
            return res.status(500).send(getGeneralError({type: type.InternalServerError}))
        }
    
        
    
        // add to db
        let salt, hashPassword;
        try{
            salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }catch(e){
            return res.status(500).send(getGeneralError({type: type.InternalServerError}))
        }
    
        const user = new User({
            username, 
            password: hashPassword, 
            email,
            salt
            
        });
        try {
            userResult = await user.save();
        }catch(error){
            return res.status(500).send(getGeneralError({error, type: type.InternalServerError}))
        }
        
    
        // sign and send tokens
        const accessToken = signAccessToken({
            username: userResult.username,
        },{expiresIn: '15s'});
        const refreshToken = signRefreshToken({
            username: userResult.username,
        });
    
        res.status(201).send({accessToken, refreshToken})
    
    }

    tokenSignIn = async (req, res) => {
    
        const { refreshToken } = req.body; 
    
        try {
            const refreshTokenResult:UserJwtPayload = verifyRefreshToken(refreshToken) as UserJwtPayload;
            if(refreshTokenResult){
                const newAccessToken = signAccessToken({
                    username: refreshTokenResult.user.username,
                },{expiresIn: '55s'});
    
                return res.status(200).send({
                    valid: true,
                    accessToken: newAccessToken
                })
            }
            return res.status(401).send({
                valid: false,
            })
    
        }catch(error){
            return res.status(401).send({
                valid: false,
            })
        }
    
    
    
     
    }

    getAccessToken = (req, res) => {
        const { refreshToken } = req.body;
        let refreshTokenPayload: UserJwtPayload;
        try{
            refreshTokenPayload = verifyRefreshToken(refreshToken) as UserJwtPayload;
    
        }catch(error){
            //return res.status(401).send('invalid access token')
            return res.status(401).send(getGeneralError({error}))
        }
    
        const newAccessToken = signAccessToken({
            username: refreshTokenPayload.user.username,
        },{expiresIn: '15s'});
    
        res.send({accessToken: newAccessToken})
    }

}


export default new Auth()