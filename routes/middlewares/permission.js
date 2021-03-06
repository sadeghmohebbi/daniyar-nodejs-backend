const { User } = require('../../models/User');

// middleware for doing role-based permissions
module.exports = function permit(...allowed) {
    
    const isAllowed = role => allowed.indexOf(role) > -1 || role == "all";
    
    // return a middleware
    return (req, res, next) => {
        const { sub: { id } } = req;
        if (id) {
            User.findById(id).then((user) => {
                if(!user) {
                    res.sendStatus(400);
                }

                req.user = user;

                if (isAllowed(req.user.role)) {
                    return next(); // role is allowed, so continue on the next middleware
                } else {
                    return res.sendStatus(403); // user is forbidden
                }
           });
        } else {
            return next();
        }
    }
}