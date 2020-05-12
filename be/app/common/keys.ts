
const getKeys = () =>{
    const { NODE_ENV } = process.env
    const env = NODE_ENV || 'production';

    if(env === 'production'){
        const { MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_HOST, NODE_ENV } = process.env;

        return ({
            auth: {
                user: { }
            },
            email: {
                google: {
                    address: process.env.GMAIL_ADDRESS,
                    oauth: {
                        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
                        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
                    }
    
                }
            },
            db: {
                mongodb: {
                    connectionString: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DB}`
                }
            }
    
    
    
        })


    }else if(env === 'development'){

        return ({
            auth: {
                user: { //jwt
                    //accessToken: process.env.AUTH_USER_ACCESS_TOKEN,
                    //refreshToken: process.env.AUTH_USER_REFRESH_TOKEN,
                }
            },
            email: {
                google: {
                    address: process.env.GMAIL_ADDRESS,
                    oauth: {
                        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
                        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
                        //accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
                        //refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
                    }
    
                }
            },
            db: {
                mongodb: {
                    connectionString: `mongodb://localhost:27017/app`
                }
            }
    
    
    
        })


    }else{
        console.error('Environment not specified, exiting...')
        process.exit(1)
    }


}

export default getKeys;