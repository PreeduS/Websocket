
const getKeys = () => ({
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
    }



})

export default getKeys;