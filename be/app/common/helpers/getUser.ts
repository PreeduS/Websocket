import {User} from '../types/user'

const getUser = (req):User => req.user.user


export default getUser;