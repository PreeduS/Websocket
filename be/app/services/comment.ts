import CommentSchema from '../mongoose/schema/comment';
import UserSchema from '../mongoose/schema/user';

type FindArgs = {
    skip?: number
    limit?: number
}
const findDefaultArgs: FindArgs = { skip: 0, limit: 10 };

class Comment {

    find = ({skip = findDefaultArgs.skip, limit = findDefaultArgs.limit }:FindArgs = findDefaultArgs) => {
        return CommentSchema
        .find()
        //.populate('user','id username')
        .populate({
            path: 'user',
            select: {
                id: 1,
                username: 1,
                logo: 1,
            }
        })
        .sort({createdAt: 1})
        //.skip(skip)
        //.limit(limit)
    }

    insert = async ({comment}) => {
        try {
            const userResult = await UserSchema.findOne({username:'testuser2'})
    
       
            const commentResult = new CommentSchema({
                comment,//: 'test4 testuser2',
                createdAt: Date.now(),
                user: userResult.id
            });
    
           const r = await commentResult.save();
           console.log('r ',r)
        }catch(error){
            
            console.log('err ',error)
            //return res.status(500).send(getGeneralError({error, type: type.InternalServerError}))
        }
    }
}


export default new Comment();