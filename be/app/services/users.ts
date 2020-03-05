import User from '../mongoose/schema/user';

type FindArgs = {
    skip?: number
    limit?: number
}
const findDefaultArgs: FindArgs = { skip: 0, limit: 10 };

class Users {

    find = ({skip = findDefaultArgs.skip, limit = findDefaultArgs.limit }:FindArgs = findDefaultArgs) => {
        return User
        .find()
        //.select({username: 1})
        //.skip(skip)
        //.limit(limit)
    }
}


export default new Users();