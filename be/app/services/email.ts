
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
import fs from 'fs';
import path from 'path';
import util from 'util';
import getKeys from 'app/common/keys';


type StoreTokensParam = {access_token:any, expiry_date: any};
type StoreRefreshTokenParam = {refresh_token:any};
type ReadTokens = () => Promise<StoreTokensParam & StoreRefreshTokenParam>;
type GetGmailTokens = (code: string) => Promise<StoreTokensParam & StoreRefreshTokenParam>;

class Auth {
    private getGmailOauth2Client = () => {
        const keys = getKeys()
 
         const oauth2Client = new OAuth2(
             keys.email.google.oauth.clientId,
             keys.email.google.oauth.clientSecret,
             'http://localhost:5000/oauth/callback/gmail/' // Redirect URL
        ); 
        return oauth2Client;
    }

    private readTokens: ReadTokens = async () => {
        const readFileAsync = util.promisify(fs.readFile);
        const file = path.resolve('./app/static/private') + '/gmailTokens.json';
        const file2 = path.resolve('./app/static/private') + '/gmailRefreshTokens.json';

        try {
            const tokensResult = await readFileAsync(file, 'utf8');
            const tokens = JSON.parse(tokensResult);
    
            const refreshTokenResult = await readFileAsync(file2, 'utf8');
            const refreshToken = JSON.parse(refreshTokenResult);

            return {
                access_token: tokens.access_token, 
                expiry_date:  tokens.expiry_date,
                refresh_token: refreshToken.refresh_token
            }

        }catch(error){
            throw error;
        }

    }

    storeTokens = async (tokens: StoreTokensParam) => {
        const writeFileAsync = util.promisify(fs.writeFile);
        const file = path.resolve('./app/static/private') + '/gmailTokens.json';

        try {
            await writeFileAsync(file, JSON.stringify(tokens))
        }catch(error){
            throw error;
        }


    }

    storeRefreshToken = async(token: StoreRefreshTokenParam) => {
        const writeFileAsync = util.promisify(fs.writeFile);

        const file2 = path.resolve('./app/static/private') + '/gmailRefreshTokens.json';
        if (token.refresh_token) {
            try {
                await writeFileAsync(file2, JSON.stringify({refresh_token: token.refresh_token}))
            }catch(error){
                throw error;
            }
        }

    }


    // sendMail

    // sendAccountConfirmationMail

    sendPasswordResetMail = async (email, token, expiresIn) => {
        const keys = getKeys();
    
        const mailOptions = {
            to:  email,//keys.email.google.address,
            subject: 'Reset password',
            html: `
                <br />
                Click <a href = "http://localhost:4200/user/callback/resetpassword/${token}">here</a> to reset password <br /><br />
                Token: ${token}<br />
                Expires in ${expiresIn}

            `,
        };
        // /user/settings/resetpassword/${token}
        // /user/callback/resetpassword/${token}

        let tokens;
        try{
            tokens = await this.readTokens()
            
        }catch(error){
            throw error;
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              type: 'OAuth2',
              user: keys.email.google.address,
              clientId: keys.email.google.oauth.clientId,
              clientSecret:  keys.email.google.oauth.clientSecret,
              refreshToken: tokens.refresh_token,
              accessToken: tokens.access_token,
              expires:  tokens.expiry_date,
            },
        });

        /*transporter.set('oauth2_provision_cb', (user, renew, callback) => {
            console.log('--------------oauth2_provision_cb user', user)
            console.log('--------------oauth2_provision_cb renew', renew)

            let accessToken = userTokens[user];
            if(!accessToken){
                return callback(new Error('Unknown user'));
            }else{
                return callback(null, accessToken);
            }
        });*/

        // on new access token generation 
        transporter.on('token', token => {
            console.log('A new access token was generated', token);

            this.storeTokens({
                access_token: token.accessToken,
                expiry_date:token.expires
                // "token_type":"Bearer"
            })
    
        });



        try{
            return transporter.sendMail(mailOptions)
        }catch(error){
            //if(error.code === 'EAUTH'){}
            // ode: 'EAUTH', command: 'AUTH XOAUTH2' 
            throw error;
        }


    }



    getGmailOAuthRedirectUrl = () => {
        const oauth2Client = this.getGmailOauth2Client();
	
        const GMAIL_SCOPES = [
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send',
        ];
        
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: GMAIL_SCOPES,
      });

      return url;

    }

    //redirect to getGmailOAuthUrl url

    // after redirect get ?code from url params
    
    getGmailTokens: GetGmailTokens = async (code) => {

        const oauth2Client = this.getGmailOauth2Client();
 
        try{
            const { tokens } = await oauth2Client.getToken(code);

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                scope: tokens.scope,
                token_type: tokens.token_type,
                expiry_date: tokens.expiry_date,
            }
        }catch(error){
            throw error;
        }
    }


}


export default new Auth()