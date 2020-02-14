
 
import {  verifyAccessToken, verifyRefreshToken, signAccessToken } from '../auth/utils/token/userTokens';
import { UserJwtPayload } from 'app/common/types/user';

// rename todo verifyAccessToken
const tokenSignIn = async (req, res) => {
    console.log('tokenSignIn')
    const { accessToken, refreshToken } = req.body; 

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


export default tokenSignIn;