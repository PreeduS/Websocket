const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
import fs from 'fs';
import path from 'path';
import util from 'util';
import emailService from 'app/services/email';

class Auth {

    // /oauth/gmail
    gmail = async (req, res) => {
        const url = emailService.getGmailOAuthRedirectUrl();
        res.redirect(url)
    }

    // /oauth/callback/gmail/
    // get all tokens, inc refresh token
    gmailCallback = async (req, res) => {
        const code = req.query.code;

        if(!code){
            return res.send('err')
        }

        try{
            const tokens = await emailService.getGmailTokens(code);

            emailService.storeTokens({
                access_token: tokens.access_token,
                expiry_date: tokens.expiry_date,
                //scope: tokens.scope,
                //token_type: tokens.token_type,
            })
            emailService.storeRefreshToken({
                refresh_token: tokens.refresh_token,
            })

 
        }catch(error){
            console.log(error)
            return res.send('error')
        }
    }



}


export default new Auth()