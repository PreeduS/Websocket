
// import express from 'express';
import { Express } from 'express';
import passport from 'passport';
import groupRoute from './groupRoute';

// controllers
//import signIn from 'app/controllers/signIn';
//import tokenSignIn from 'app/controllers/tokenSignIn';
//import signUp from 'app/controllers/signUp';
import Users from 'app/controllers/users';
import User from 'app/controllers/user';
//import getAccessToken from 'app/controllers/getAccessToken';
import Auth from 'app/controllers/auth';
import OAuth from 'app/controllers/oauth';
//import Dev from 'app/controllers/dev';

// validations
import signUpValidation from 'app/validations/signUp';
import signInValidation from 'app/validations/signIn';
import getAccessTokenValidation from 'app/validations/getAccessToken';
import tokenSignInValidation from 'app/validations/tokenSignIn';

const setupRoutes = (app: Express) => {
    app.use('/', (req, res, next) => { 
            console.log('path ',req.path)
        next()
    })
    app.get('/', (req, res) => { 
            console.log('path ',req.path)
        res.send('/') 
    })
    

   // app.get('/dev/sendPasswordResetMail/',Dev.sendPasswordResetMail)
    
    /*(req, res) => { 
            console.log('path ',req.path)
        res.send('/oauth/callback/gmail/') 
    })*/
    const oauthRoute = groupRoute(app, '/oauth');
        oauthRoute.get('/callback/gmail/',OAuth.gmailCallback);
        oauthRoute.get('/gmail', OAuth.gmail);
    
    const authRoute = groupRoute(app, '/auth')
        authRoute.post('/signIn', [signInValidation], Auth.signIn)
        authRoute.post('/tokenSignIn', [tokenSignInValidation], Auth.tokenSignIn)
        authRoute.post('/signUp', [signUpValidation], Auth.signUp)
        //authRoute.get('/gmail',  Auth.gmail )
        authRoute.post('/getAccessToken',[getAccessTokenValidation],  Auth.getAccessToken )
        // authRoute.get('/secret/local', [passport.authenticate('local', {session: false})] , (req, res) =>  res.send('secret local') )
        authRoute.get('/secret/jwt', [passport.authenticate('jwt', {session: false})] , (req, res) => {
             console.log('jwt')
            return res.send({result:'secret jwt'})
        })

    //app.get('/users', [passport.authenticate('jwt', {session: false, successRedirect: '/users/self', failureRedirect: '/users/other'})], users)
    app.get('/users', Users.find)

    //app.get('/user/:id', [passport.authenticate('jwt', {session: false, /*successRedirect: '/user/d/self', failureRedirect: '/user/d/other'*/})], 
    //  app.get('/user/:username?', [passport.authenticate('jwt', {session: false, failureRedirect: '/user/other'})], 
    
    //app.get('/user/self',[passport.authenticate('jwt', {session: false})], (req, res) => {   console.log('req user self ',req.user);  res.send('/user/self ' + req.params.username) })
    //app.get('/user/other', (req, res) => {   console.log('req user other',req.user); res.send('/user/other '+ req.params.id) })



    /*app.get('/user', [passport.authenticate('jwt', {session: false})], (req, res) => {
        
        return res.send('user/self ' + req.user.username)
    }) */

    app.get('/user/profile/:username?', User.profile)
    app.post('/user/sendResetPasswordToken', User.sendResetPasswordToken)            // sendPasswordResetMail
    app.post('/user/resetPassword/:token', User.resetPassword)              //callback
    app.get('/test', (req, res) => {
     
        res.send('testt')
        
    })

    app.all('*', (req, res) => { res.send('/fallback') });
}




export default setupRoutes;





//const router = require('express').Router();

//----
//const setupRoutes = (app: Express) => {
    //app.get('/', (req, res) => { res.send('home'); });

    //app.use('/auth',router );

//----

//router.get('/test',  (req, res) =>  res.send('test') )
//router.get('/secret/local', passport.authenticate('local', {session: false}) , (req, res) =>  res.send('secret local') )
 
//router.get('/secret/jwt', passport.authenticate('jwt', {session: false}) , (req, res) =>  res.send('secret jwt') )

//  passport.authenticate('local', { failureRedirect: '/login' }),


    //router.post('/signIn', [signInValidation], signIn);
    //router.post('/signUp', [signUpValidation], signUp);