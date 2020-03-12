
// import express from 'express';
import { Express } from 'express';
import passport from 'passport';
import groupRoute from './groupRoute';

// controllers
import Users from 'app/controllers/users';
import User from 'app/controllers/user';
import Auth from 'app/controllers/Auth';
import OAuth from 'app/controllers/oauth';


// validations
//import signUpValidation from 'app/validations/signUp';
//import signInValidation from 'app/validations/signIn';
//import getAccessTokenValidation from 'app/validations/getAccessToken';
//import tokenSignInValidation from 'app/validations/tokenSignIn';

import AuthValidation from 'app/validations/Auth'

const setupRoutes = (app: Express) => {
    app.use('/', (req, res, next) => { 
            console.log('path ',req.path)
        next()
    })
    app.get('/', (req, res) => { 
            console.log('path ',req.path)
        res.send('/') 
    })
    

    
    const oauthRoute = groupRoute(app, '/oauth');
        oauthRoute.get('/callback/gmail/',OAuth.gmailCallback);
        oauthRoute.get('/gmail', OAuth.gmail);
    
    const authRoute = groupRoute(app, '/auth')
        authRoute.post('/signIn', [AuthValidation.signIn], Auth.signIn)
        authRoute.post('/tokenSignIn', [AuthValidation.tokenSignIn], Auth.tokenSignIn)
        authRoute.post('/signUp', [AuthValidation.signUp], Auth.signUp)
        //authRoute.get('/gmail',  Auth.gmail )
        authRoute.post('/getAccessToken',[AuthValidation.getAccessToken],  Auth.getAccessToken )
        // authRoute.get('/secret/local', [passport.authenticate('local', {session: false})] , (req, res) =>  res.send('secret local') )
        authRoute.get('/secret/jwt', [passport.authenticate('jwt', {session: false})] , (req, res) => {
             console.log('jwt')
            return res.send({result:'secret jwt'})
        })


    app.get('/users', Users.find)


    app.get('/user/profile/:username?', User.profile)
    app.post('/user/imageUpload', User.imageUpload)            // sendPasswordResetMail
    app.post('/user/sendResetPasswordToken', User.sendResetPasswordToken)            // sendPasswordResetMail
    app.post('/user/resetPassword/:token', User.resetPassword)              //callback
    app.get('/test', (req, res) => {
     
        res.send('testt')
        
    })

    app.all('*', (req, res) => { res.send('/fallback') });
}




export default setupRoutes;


