require('dotenv').config();
const { User } = require('../models');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;
opts.passReqToCallback = true;

passport.use(
    new JwtStrategy(opts, async (req, jwt_payload, done) => {
        try {
            console.log('passport')
            const path = req.baseUrl.split('/')[2];
            if (Date.now() < jwt_payload.exp) {
                throw new Error('Token Expired');
            } else {
                const user = await User.findOne({
                    where: {
                        id: jwt_payload.id,
                        email: jwt_payload.email
                    }
                })
                delete user.dataValues.password;
                if (req.params.id != jwt_payload.id && path == 'profile') {
                    throw new Error('Unauthorized')
                }
                return done(null, user.dataValues);
            }
        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    })
)

module.exports = passport.authenticate('jwt', { session: false });

