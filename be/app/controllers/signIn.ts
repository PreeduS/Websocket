
import signToken from '../auth/utils/token/signToken';
import { signAccessToken, signRefreshToken } from '../auth/utils/token/userTokens';
import User from '../../app/mongoose/schema/user';
import verifyPassword from '../auth/utils/verifyPassword';
import { getGeneralError, type } from 'app/common/utls/getError';

const signIn = async (req, res) => {

    const {username, password} = req.body; 
    let userResult;
    try {
        userResult = await User.findOne({username})
    }catch(e){
        return res.status(500).send(getGeneralError({type: type.InternalServerError}))
    }



    if(!userResult){
        return res.status(400).send(getGeneralError({message:'Wrong username or password'}))
    }


    const { password: hashPassword } = userResult;
    let passwordMatch;
    try {
        passwordMatch = await verifyPassword(password, hashPassword)
    }catch(error){
        return res.status(500).send(getGeneralError({type: type.InternalServerError}))
    }
    
 

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


export default signIn;