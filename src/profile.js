const Profile = require('./profileSchema');
const errHandler = require('./ErrHandler/errHandler');

const getHeadline = (req, res) => {
       if (req.params.user) {req.user = req.params.user};
         Profile.findOne({'username': req.user})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(401);
                return errHandler(err);
            }
            if (status) {
                return res.send({
                    username: req.user,
                    headline: status.headline,
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

const putHeadline = (req, res) => {
    if (!req.body.headline) return res.sendStatus(400);
    (async () => {
        let profile = await Profile.findOne({'username': req.user});
        profile.headline = req.body.headline;
        await profile.save();
        return res.send({
            username: req.user,
            headline: profile.headline,
            status: 'success'
        })
    })()
}

const getEmail = (req, res) => {
    if (req.params.user) {req.user = req.params.user};
    Profile.findOne({'username': req.user})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(401);
                return errHandler(err);
            }
            if (status) {
                return res.send({
                    username: req.user,
                    email: status.email,
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

const putEmail = (req, res) => {
    if (!req.body.email) return res.sendStatus(400);
    (async () => {
        let profile = await Profile.findOne({'username': req.user});
        profile.email = req.body.email;
        await profile.save();
        return res.send({
            username: req.user,
            email: profile.email,
            status: 'success'
        })
    })()
}

const getZipcode = (req, res) => {
    if (req.params.user) {req.user = req.params.user};
    Profile.findOne({'username': req.user})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(401);
                return errHandler(err);
            }
            if (status) {
                return res.send({
                    username: req.user,
                    zipcode: status.zipcode,
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

const putZipcode = (req, res) => {
    if (!req.body.zipcode) return res.sendStatus(400);
    (async () => {
        let profile = await Profile.findOne({'username': req.user});
        profile.zipcode = req.body.zipcode;
        await profile.save();
        return res.send({
            username: req.user,
            zipcode: profile.zipcode,
            status: 'success'
        })
    })()
}

const getDob = (req, res) =>{
    if (req.params.user) {req.user = req.params.user};
    Profile.findOne({'username': req.user})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(401);
                return errHandler(err);
            }
            if (status) {
                return res.send({
                    username: req.user,
                    dob: status.dob,//(new Date('01/01/2000')).toDateString()
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

//TODO: FIX THIS END-POINT
const getAvatars = (req, res) => {
    if (req.params.user) {req.user = req.params.user};
    Profile.findOne({'username': req.user})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(401);
                return errHandler(err);
            }
            if (status) {
                return res.send({
                    username: req.user,
                    avatars: status.avatars,
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

const putAvatars = (req, res) => {
    if (!req.body.avatars) return res.sendStatus(400);
    (async () => {
        let profile = await Profile.findOne({'username': req.user});
        profile.avatars = req.body.avatars;
        await profile.save();
        return res.send({
            username: req.user,
            avatars: profile.avatars,
            status: 'success'
        })
    })()
}

module.exports = app => {
    app.get('/headline/:users?', getHeadline)
    app.put('/headline', putHeadline)
    app.get('/email/:user?', getEmail)
    app.put('/email', putEmail)
    app.get('/zipcode/:user?', getZipcode)
    app.put('/zipcode', putZipcode)
    app.get('/dob',getDob)
    app.get('/avatar/:user?', getAvatars)
    app.put('/avatar', putAvatars)
}
