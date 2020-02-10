import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const setupPassport = () => {
    // todo remove LocalStrategy
   passport.use(
       new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false
       }, async (username, password, done) => {
            try {
                
                // db user
                const user = {
                    username: 'username',
                    password: 'password'
                }
                
                if(!user){
                    return done(null, false);   
                }
                
                // todo hash
                if(user.password !== password){
                    return done(null, false);   
                }
                
                return done(null, user);    

            }catch(e){
                return done(e, false);
            }

       })
   )



   passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: 'secret'
    }, async (payload, done) => {
        console.log('jwt payload ', payload)

        return done(null, payload);    
       /* try{
            //find user in db
            const {user} = payload;
            const userResult = await User.findOne({
                where: {username: user.username},
                select:['username']
            });
            console.log('from jwt userResult ',userResult)

            //no user
            if(!user){
                return done(null, false);   
            }
            return done(null, user);    

        }catch(e){
            return done(e, false);
        }*/
    })
);



}

export default setupPassport