
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
