import passport from 'passport';
import bcrypt from 'bcrypt';
import fs from 'fs';
import userService from 'app/services/user';
import UserSchema from 'app/mongoose/schema/user';
import { getGeneralError, type } from 'app/common/utls/getError';

class User {
    private validateUser = (req, res) => {

        return new Promise((resolve, reject) => {

            passport.authenticate('jwt', {session: false}, (error, user, info) => {
                console.log('user ',user)
                let isSelf = false;
    
                if(error){
                    reject({message: 'error', isSelf})
                    return;
                }
                if(!user && !req.params.username){
                    reject({message: 'error 2', isSelf})
                    return;
    
                }
                
                if(user){
                    // isSelf = user.username ===  req.params.username;
                    if(req.params.username){
                        isSelf = user.username ===  req.params.username;
                    }else{
                        isSelf = true;
                        
                    }
                }else {
                    isSelf = false;
                }
    
                resolve({username:req.params.username , isSelf})    
    
            })(req, res);

        })

         


    }

    profile = async (req, res) => {
        try{
            const result: any = await this.validateUser(req, res)
            return res.send('/user/profile/...' + result.username + ', '+ result.isSelf)
        }catch(error){
            return res.send(error)
        }


    }

    sendResetPasswordToken = async (req, res) => {
        try{
            const result = await userService.sendResetPasswordToken('testapp.noreplay@gmail.com');

            return res.send(result)
        }catch(error){
            console.log(error);
            return res.send('err')
        }

    }

    resetPassword = async (req, res) => {
        const token = req.params.token;    //ee504d85-beb6-43a1-b568-7e3296bc99fd

        try{
            const result = await userService.verifyResetPasswordToken('testapp.noreplay@gmail.com', token)  // username todo
            
            // todo validate reset and add validation
            // create svc
            const {username, password} = req.body;
            let userResult;
            let user;
            // check if user is taken
            try {
                user = await UserSchema.findOne({username});
                if(!result){
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
                
                /*const user = new UserSchema({
                    username, 
                    password: hashPassword,
                    salt
                    
                });
                */
                user.password = hashPassword;
                user.salt = salt;
                try {
                    userResult = await user.save();
                }catch(error){
                    return res.status(500).send(getGeneralError({error, type: type.InternalServerError}))
                }
                


            }catch(e){
                return res.status(500).send(getGeneralError({type: type.InternalServerError}))
            }
        

            return res.send('valid '+ result)
        }catch(error){
            console.log(error);
            return res.send('err')
        }
    }

    // profile/settings
    imageUpload = async (req, res) => {
        const base64Upload = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';      
        const splitBy = ';base64,';
        const splitByExists = base64Upload.includes(splitBy);

        if(splitByExists){
            const uploadArray = base64Upload.split(splitBy);
            const mimeType = uploadArray[0];
            const base64Image = uploadArray[1];
            
            if(mimeType && base64Image){
                const fileName = `image_${Date.now()}_${Math.random()*100}.png`;
                fs.writeFile(fileName, base64Image, {encoding: 'base64'}, function(err) {
                    if(err){
                        return res.send('File upload error')
                    }
                    return res.send('File created: ' + fileName)
                
                });
            }
        }
    }


}


export default new User();