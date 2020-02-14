import { verifyRefreshToken, signAccessToken } from '../auth/utils/token/userTokens';
import { UserJwtPayload } from 'app/common/types/user';


const getAccessToken = (req, res) => {
    const {  refreshToken } = req.body;
    let refreshTokenPayload: UserJwtPayload;
    try{
        refreshTokenPayload = verifyRefreshToken(refreshToken) as UserJwtPayload;

    }catch(e){
        return res.status(401).send('invalid access token')
    }

    const newAccessToken = signAccessToken({
        username: refreshTokenPayload.user.username,
    },{expiresIn: '15s'});

    res.send({accessToken: newAccessToken})
}

export default getAccessToken;