import bcrypt from 'bcrypt';
import { RequestHandler, Params } from 'app/common/types/express';
import { getGeneralError, type } from 'app/common/utls/getError';
import User from '../../app/mongoose/schema/user';
import signToken from '../auth/utils/signToken';

export type ReqBody = {
    username: string
    password: string
    email: string
}

const signUp: RequestHandler <Params, any, ReqBody> = async (req, res, next) => {

    const {username, password, email} = req.body;
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
    
    console.log('userResult ',userResult )

    // sign token
    const token = signToken({
        username: userResult.username,
    });


    // send token
    res.status(201).send({accessToken:token})

}

export default signUp;