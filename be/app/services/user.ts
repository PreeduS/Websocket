import UserSchema from 'app/mongoose/schema/user';
import emailService from 'app/services/email';
import { v4 as uuidv4 } from 'uuid';

type FindArgs = {
    skip?: number
    limit?: number
}
const findDefaultArgs: FindArgs = { skip: 0, limit: 10 };

class User {

  /*  find = ({skip = findDefaultArgs.skip, limit = findDefaultArgs.limit }:FindArgs = findDefaultArgs) => {
        return User
        .find()
        .select({username: 1})
        .skip(skip)
        .limit(limit)
    }*/
    
    // user ?
    private generateResetPasswordToken = () => {
        // token + expiration ?

        // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
        // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d;wqeqweqweqwe
        const uuid = uuidv4();
        if(uuid.includes('_')){
            throw new Error('Failed to generate reset token');
        }
        const expiresIn = 1 * 60 * 60 * 1000;       // ms // 1h
        const expirationAt = Date.now() + expiresIn;
        return uuid+'_'+expirationAt;
    }
    verifyResetPasswordToken = async (email, token) => {
        try{
            const user = await UserSchema.findOne({email})
            if(!user){
                throw new Error('Invalid user')
            }
            const resetPasswordToken = user.resetPasswordToken;

            const dbTokenValue = resetPasswordToken && resetPasswordToken.split('_')[0];
            const dbTokenExpireAt = resetPasswordToken && resetPasswordToken.split('_')[1];
            const expired = Date.now() > parseInt(dbTokenExpireAt, 10)
            console.log('expired: ',expired)
            console.log('token: ',token)
            console.log('dbTokenValue: ',dbTokenValue)
            console.log('token === dbTokenValue: ',token === dbTokenValue)
            if(expired){
                throw new Error('Token expired')
            }else if(token === dbTokenValue){
                return true;
            }else{
                throw new Error('Invalid token')
            }
        }catch(error){
            console.log(error)
            throw new Error('err')
        }
     
    }

    //saveResetPasswordToken = async (username) => {
    sendResetPasswordToken = async (email) => {
        let resetPasswordToken;
        try{
            resetPasswordToken =  this.generateResetPasswordToken()
        }catch(error){
            return new Error('Failed to generate reset token')
        }

        

        const user = await UserSchema.findOne({email})
        if(!user){
            throw new Error('no user')
        }
        try {
            // store
            user.resetPasswordToken = resetPasswordToken;
            try{
                //const userResult = 
                await user.save();
            }catch(error){
                throw error;
            }

            // send mail
            // todo - add to email
            try{
                const token = resetPasswordToken.split('_')[0];
                emailService.sendPasswordResetMail(email, token, '1h');
            }catch(error){
                throw new Error('mail send error')
            }

            //return userResult;
            return {token: resetPasswordToken.split('_')[0]}
        }catch(error){
            throw error;
            //return res.status(500).send(getGeneralError({error, type: type.InternalServerError}))
        }


        
    }



}


export default new User();