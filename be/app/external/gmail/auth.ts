import getKeys from 'app/common/keys';
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
import fs from 'fs';
import path from 'path';
import util from 'util';

// todo - remove
class Auth {
    private oauth2Client;

    private getGmailOauth2Client = () => {
        const keys = getKeys()

        const oauth2Client = new OAuth2(
            keys.email.google.oauth.clientId,
            keys.email.google.oauth.clientSecret,
            'http://localhost:5000/oauth/callback/gmail/' // Redirect URL
       ); 
       return oauth2Client;
    }


    constructor(){
        this.oauth2Client = this.getGmailOauth2Client();
    }



   // setCredentials = (tokens) => {

/*
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    scope: tokens.scope,
                    token_type: tokens.token_type,
                    expiry_date: tokens.expiry_date,
*/

/*
        //just write to file
        if( tokens.access_token){
            //console.log('--- (tokens', tokens)
            this.oauth2Client.setCredentials({
                access_token: tokens.accessToken,
                expiry_date:tokens.expires
            });
        }
        */
    //}
   
   /*
    getOauth2Client = () => {
        
        return this.oauth2Client;
    }*/
}

export default new Auth()