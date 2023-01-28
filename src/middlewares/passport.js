const { ExtractJwt, Strategy } = require("passport-jwt");
const { User } = require("../models");
const config = require("../config/loginConfig");

module.exports = function (passport) {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.login.jwtEncryption;

    passport.use(
        new Strategy(opts, async function (jwtPayload, done) {
            User.findOne({
                where: { id: jwtPayload.user_id }
            })
                .then(user => {
                    if (user) return done(null, user);
                    else return done(null, false);
                })
                .catch(err => {
                    return done(err, false);
                });
        })
    );
};
