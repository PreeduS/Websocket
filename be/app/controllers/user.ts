import passport from 'passport';

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

    // settings
}


export default new User();