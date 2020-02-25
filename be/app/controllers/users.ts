import User from '../mongoose/schema/user';
import { getGeneralError, type } from 'app/common/utls/getError';
import UsersService from 'app/services/users';


class Users {

    find = async(req, res) =>{
        let userResult;
  
        try {    
            userResult = await UsersService.find({limit: 10})
        }catch(error){
            return res.status(500).send(getGeneralError({type: type.InternalServerError}))
        }
    
    
        res.send({userResult});
    }
}


export default new Users();


