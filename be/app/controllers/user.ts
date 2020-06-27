import passport from 'passport';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import userService from 'app/services/user';
import UserSchema from 'app/mongoose/schema/user';
import { getGeneralError, type } from 'app/common/utls/getError';
import getUser from 'app/common/helpers/getUser'
import axios from 'axios'

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
            // todo add user validation

        const username = getUser(req).username;
        console.log('username 1 ----',req.user, username)
   


        const base64Upload = req.body.image;//'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';   
   
  
                try {

                    const response = await axios.post('http://localhost:5010/user/avatar', {
                        base64Upload, 
                      })
                      return res.send(response.data)
                }catch(e){
                    //console.log('err',e)
                    return res.status(500).send('e')
                }

                //}


    
  
    }


}


export default new User();