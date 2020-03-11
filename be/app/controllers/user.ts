import passport from 'passport';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
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


    private imageUploadValidation = (base64Image: string) => {
        let returnData = { valid: false, ext: null };

        const splitBy = ';base64,';
        const splitByExists = base64Image.includes(splitBy);
        if(splitByExists){
            return returnData;
        }
        /*
            # offset 0
            .jpg/.jpeg
                FF D8 FF DB
                FF D8 FF E0
                FF D8 FF EE
                FF D8 FF E1
            # end with      FF D9

            .png	    89 50 4e 47
            # end with      49 45 4E 44 AE 42 60 82
        */

        const magicNumbers = [
            { 
                header: 'FFD8',
                trailer: 'FFD9',
                ext: 'jpg' 
            },
            {   
                header: '89504E47',
                trailer: '49454E44AE426082',
                ext: 'png'
            },
            {   
                header: '424D',
                trailer: null,
                ext: 'bmp'
            },
            {   
                header: '49492A00',
                trailer: null,
                ext: 'tif'
            },
        ]
        const startsWith = (string, substring) => string.indexOf(substring) === 0;
        const endsWith = (string, substring) => string.indexOf(substring, string.length - substring.length ) !== -1;

        var buf = new Buffer(base64Image, 'base64');
        const hexValue = buf.toString('hex').toUpperCase()
        //const header = buf.slice(0,4).toString('hex').toUpperCase();                // buf.slice(0,2)
        //const trailer = buf.slice(buf.length-12).toString('hex').toUpperCase();      // buf.slice(buf.length-2)


        magicNumbers.forEach(mn => {
            const validHeader =  mn.header === null ? true: startsWith(hexValue, mn.header);
            const validTrailer =  mn.trailer === null ? true: endsWith(hexValue, mn.trailer);
            if( validHeader && validTrailer){
                returnData = {valid: true, ext: mn.ext};
            }
        });


        return returnData


    }
    // profile/settings
    imageUpload = async (req, res) => {




        /*
        
            var buf = new Buffer(data, 'base64');

            buf.slice(0,4)
            fs.writeFile('image.png', buf);

            buf.toString('hex')
            // parseInt("10101001", 2).toString(16).toUpperCase()
        */


        const base64Upload = req.body.image;//'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA';   
        const splitBy = ';base64,';
        const splitByExists = base64Upload.includes(splitBy);

        if(splitByExists){
            const uploadArray = base64Upload.split(splitBy);
            const mimeType = uploadArray[0];
            const base64Image = uploadArray[1];



            const validationResult = this.imageUploadValidation(base64Image);





            return res.send('upload tmp')
            
            if(mimeType && base64Image){
                const fileName = `image_${Date.now()}_${Math.random()*100}.png`;    // use uuid
                const file = path.resolve('./app/static/private/'+fileName) ;


               // if(false){
                    fs.open(file, 'wx', (err, fd) => {
                        if (err) {
                          if (err.code === 'EEXIST') {
                            console.error('file already exists');
                            return;
                          }
                      
                          throw err;
                        }


                        fs.writeFile(file, base64Image, {encoding: 'base64'}, function(err) {           // encoding: 'binary'
                            if(err){
                                console.log(err)
                                fs.close(fd, (err) => {
                                    if (err) throw err;
                                });
                                return res.send('File upload error')
                            }
                            fs.close(fd, (err) => {
                                if (err) throw err;
                            });
                            return res.send('File created: ' + fileName)
                        
                        });



                    
                      });
    
                //}


            }else{
                return res.send('err')
            }
        }else{
            return res.send('err2')
        }
    }


}


export default new User();