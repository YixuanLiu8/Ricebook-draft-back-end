const Profile = require('./profileSchema');
const errHandler = require('./ErrHandler/errHandler');

const getFollower = (req,res) =>{
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
                    follower: status.follower,
                    status: 'success'
                })
            }
            return res.sendStatus(400);
        })
}

const putFollower=(req,res)=>{
    Profile.findOneAndUpdate(
        {'username': req.user},
        {$push: {follower: req.params.user}},
        (err, status) => {
            if (err) {
                return res.sendStatus(400);
            } else {
                return res.send({
                    username : req.user,
                    follower: [...status.follower, req.params.user],
                    status: 'success'
                })
            }
        });
}

const delFollower=(req,res)=>{
    Profile.findOneAndUpdate(
        {'username': req.user},
        {$pull: {follower: req.params.user}},
        (err, status) => {
            if (err) {
                return res.sendStatus(400);
            } else {
                return res.send({
                    username : req.user,
                    follower: status.follower.filter(ele => ele !== req.params.user),
                    status: 'success'
                })
            }
        });
}

module.exports = (app) => {
    app.get('/following/:user?', getFollower);
    app.put('/following/:user', putFollower);
    app.delete('/following/:user', delFollower);
}
