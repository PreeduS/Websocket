
export const user = {
    username: {
        length:{
            min: 8,
            max: 32,
        },
        pattern: '^[a-zA-Z\- ]+$'

    },
    password: {
        length:{
            min: 8,
            max: 512,
        }, 
    },
    email: {
        length:{
            min: 8,
            max: 256,
        }, 
    }
}
