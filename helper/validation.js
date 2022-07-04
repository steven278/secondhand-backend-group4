require('dotenv').config();
const { User } = require('../models');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
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
                return done(null, user.dataValues);
            }
        } catch (err) {
            console.log(err);
            return done(err, false);
        }
    })
)

module.exports = passport.authenticate('jwt', { session: false });

