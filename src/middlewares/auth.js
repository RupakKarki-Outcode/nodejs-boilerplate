import passport from "passport";
import { unauthorized } from "./errorHandler";
require("../middlewares/passport")(passport);

export const validateAuthUser = function (req, res, next) {
  // requires auth
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err, user, _info) {
      req.authenticated = !!user;
      req.user = user;
      if (!user) {
        return unauthorized(req, res);
      }
      next();
    }
  )(req, res, next);
};
