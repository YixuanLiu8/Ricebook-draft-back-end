let cookieKey = "sid";

function isLoggedIn(req, res, next){
    // likely didn't install cookie parser
    if (!req.cookies) {
       return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];
    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }
    redis.get(sid, (err, res) => {
        if (err) {return res.sendStatus(401);}
        req.user = res;
        next();
    })
}

module.exports = (app) => {
    app.use(isLoggedIn);
}
