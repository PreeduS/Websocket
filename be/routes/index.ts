const router = require('express').Router();
import passport from 'passport'

import signIn from '../controllers/signIn'
 
router.get('/test',  (req, res) =>  res.send('test') )
router.get('/secret/local', passport.authenticate('local', {session: false}) , (req, res) =>  res.send('secret local') )
 

//  passport.authenticate('local', { failureRedirect: '/login' }),


//post
router.get('/secret/jwt', passport.authenticate('jwt', {session: false}) , (req, res) =>  res.send('secret jwt') )



    //post
    router.get('/signIn', signIn);

    // {"token":
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoidGVzdCJ9LCJpYXQiOjE1ODEwOTQ2OTIsImV4cCI6MTU4MTA5ODI5Mn0.SdKCnNQgw9iCnksf2UaywGQt3-MhBhd9N22unKqtlj0"
    //}

const setRoutes = (app) => {
    app.get('/', (req, res) => { res.send('home'); });
    

 
    app.use('/auth',router );
}




export default setRoutes