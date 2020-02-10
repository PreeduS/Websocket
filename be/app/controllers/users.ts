import User from '../mongoose/schema/user';
import { getGeneralError, type } from 'app/common/utls/getError';


const users = async (req, res) => {
    let userResult;
  
    console.log(' usersreq ',req.user)
    try {    
        userResult = await User
        .find()
        .select({username: 1})
        // .skip(2)
        // .limit(5)
    }catch(error){
        return res.status(500).send(getGeneralError({type: type.InternalServerError}))
    }


    res.send({userResult});
}

export default users;


