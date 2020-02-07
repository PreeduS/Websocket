
import signToken from '../auth/utils/signToken'

const signIn = (req, res) => {
    //  console.log('req.user ',req.user)
        //const {username, password} = req.user; 
    //const token = signToken(req.user);
    const token = signToken({
        username: 'test'
    });
    res.status(200).send({token})
}


export default signIn;