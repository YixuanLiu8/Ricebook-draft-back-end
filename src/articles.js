const Articles = require('./articleSchema');
const Profile = require('./profileSchema');
const errHandler = require('./ErrHandler/errHandler');

const postArticles=(req,res)=>{
    (async () => {
        await Articles.create({
            name: req.user,
            content: req.body.content,
            image: req.body.image,
        })
        let articles = await Articles.find({'name': req.user});
        if (articles) {
            return res.send({
                username: req.user,
                articles: articles,
                status: 'success'
            })
        }
        return res.sendStatus(400);
    })();
}
const getArticles=(req,res)=>{
    if (req.params.id) {/** take specific id  */
    // if is user id
    Profile.findOne({'username': req.params.id})
        .exec((err, status) => {
            if (err) {
                res.sendStatus(400);
                return errHandler(err);
            }
            if (status) {
                Articles.find({'name': req.params.id})
                    .exec((err, status) => {
                        if (err) {
                            res.sendStatus(400);
                            return errHandler(err);
                        }
                        if (status) {
                            return res.send({
                                articles: [status],
                                status: 'success'
                            })
                        }
                        return res.sendStatus(400);
                    })
            } else {
                // if is article id
                Articles.findOne({'_id': req.params.id})
                    .exec((err, status) => {
                        if (err) {
                            res.sendStatus(400);
                            return errHandler(err);
                        }
                        if (status) {
                            return res.send({
                                articles: [status],
                                status: 'success'
                            })
                        }
                        return res.sendStatus(400);
                    })
            }
        })
    } else {
        Profile.findOne({'username': req.user})
            .exec((err, status) => {
                if (err) {
                    res.sendStatus(400);
                    return errHandler(err);
                }
                if (status) {
                    // find user's post
                    Articles.find({'name': [req.user, ...status.follower]})
                        .exec((err, userPosts) => {
                            if (err) {
                                res.sendStatus(400);
                                return errHandler(err);
                            }
                            return res.send({
                                username : req.user,
                                articles: userPosts,
                                status: 'success'
                            })
                        })
                }

            })
    }
}
const putArticles=async (req,res)=>{
       let articles= await Articles.findOne({'_id':req.params.id});
        articles.content=req.body.text;
        await articles.save();
        let posts = await Articles.find({'name': req.user});
    res.send({articles: posts, status: 'success'})
}


module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', putArticles);
    app.post('/article', postArticles);
}

