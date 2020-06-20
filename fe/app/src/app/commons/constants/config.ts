
export const validation = {
    username: {
        length:{
            min: 8,
            max: 32,
        },
        pattern: '^[a-zA-Z\-]+$'

    },
    password: {
        length:{
            min: 8,
            max: 512,
        }, 
    },
    email: {
        length:{
            min: 6,
            max: 256,
        }, 
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-.]+\.([a-zA-Z]+\.{0,1}[a-zA-Z]+)$/
    }
}
