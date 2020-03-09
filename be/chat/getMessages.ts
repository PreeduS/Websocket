import { UserJwtPayload } from 'app/common/types/user';

type MessageType = {
    auth: 'auth',
    user: 'user',
    users: 'users',
    comment: 'comment',
    comments: 'comments',
}
type UserType = {
    signIn: 'signIn',
    signOut: 'signOut',
    //getUsers: 'getUsers',
}


export const messageType: MessageType = {
    auth: 'auth',
    user: 'user',
    users: 'users',
    comment: 'comment',
    comments: 'comments',
}

export const userType: UserType = {
    signIn: 'signIn',
    signOut: 'signOut',
    //getUsers: 'getUsers',       // todo remove and move to MessageType.users
}


export type CommentData = {
    type: typeof messageType.comment;
    data: {
        comment: string
        username: string
    }
};

export type CommentsData = {
    type: typeof messageType.comments;
    data: {
        comments: Array<{comment: string, username: string}>
    }
};

export type UserData = {
    type: typeof messageType.user;
    data: {
        username: string
        type: UserType['signIn'] | UserType['signOut'] ;
    }
}/* | {
    type: typeof messageType.user;
    data: {
        users: Array<{username: string}>
        type:  UserType['getUsers']; 
    }
};*/

export type UsersData = {
    type: typeof messageType.users;
    data: {
        users: Array<{username: string}>
       
    }
}

export type AuthData = {
    type: typeof messageType.auth,
    data: {
        authenticated: boolean,
        user?: any
    }
};


type GetCommentParams = {
    comment: string
    username: string
}
export const getComment = ({comment, username}: GetCommentParams) => 
    JSON.stringify({
        type: messageType.comment,
        data: {
            comment, 
            username
        }
    } as CommentData)


// todo 
export const getComments = ({comments}) => {
    const updatedComments = comments.map(x => ({
        comment: x.comment,
        username: x.user.username
    }))

    return JSON.stringify({
        type: messageType.comments,
        data: {
            comments: updatedComments, 
        }
    } as CommentsData)

}

type GetUserParams = {
    userType: UserType['signIn'] | UserType['signOut'];
    username: string
}
export const getUser = ({userType, username}: GetUserParams) => 
    JSON.stringify({
        type: messageType.user,
        data: {
            username: username,
            type: userType
        }
    } as UserData)


type GetUsersParams = {
   // userType: UserType['getUsers'];
    users:  Array<{username: string}>
}
//export const getUsers = ({userType, users}: GetUsersParams) => 
export const getUsers = ({users}: GetUsersParams) => 
    JSON.stringify({
        type: messageType.users,
        data: {
            users,
           // type: userType
        }
    } as UsersData)

type GetAuthParams = {
    authenticated: boolean
    user?: UserJwtPayload['user']
}
export const getAuth = ({authenticated, user}: GetAuthParams) =>
    JSON.stringify({
        type: messageType.auth,
        data: {
            authenticated,
            user
        }

    } as AuthData)
