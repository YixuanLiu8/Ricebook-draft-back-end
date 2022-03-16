const md5 = require('md5');
const errHandler = require('./ErrHandler/errHandler');
const auth = require('./Middleware/auth');
global.redis = require('redis').createClient('redis://:pd61fa301f024a8bc380d2a96a1953099105cfd0c92b1925d06dbb9f83c994674@ec2-3-93-161-4.compute-1.amazonaws.com:30959')
const User = require('./userSchema');
const Profile = require('./profileSchema');

redis.on('error', (err) => {
    console.log("Redis error: " + err);
})
//flush all redis when start again
redis.flushall((err, reply) => {
    if (err) console.log("Redis Clean error: " + err)
    console.log("Redis Clean: " + reply);
})

const cookieKey='sid';

let cnt = 0;
//let userObjs = {};
const expireTime = 5000;

const postLogin = async (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400).send('Username and Password is required!');
    }

    let user = await User.findOne({'username': username});
    if (!user) {
        return res.sendStatus(401).send('User not existed!')
    }

    let hash = md5(user.salt + password);
    if (hash === user.hash) {
        let sid = cnt++;
        // sessionUser[sid] = username
        // redis
        redis.setex(sid, expireTime, username);
        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: expireTime * 1000, httpOnly: true });
        let msg = {username: username, status: 'success'};
        res.send(msg);
    }
    else {
        res.sendStatus(401).send('Seems that password is invalid!');
    }
}

const putLogout = (req,res) => {
    if (!req.cookies) {
        return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.sendStatus(401);
    }
    redis.del(sid);
    res.cookie(cookieKey, sid, { maxAge: 5 * 1000, httpOnly: true });
    res.send({status: 'success'});
}

const postRegister = async (req, res)=> {
    let username = req.body.username;
    let password = req.body.password;
    let email=req.body.email;
    let dob=req.body.dob;
    let zipcode=req.body.zipcode;
    let phone=req.body.phone;

    if (!username || !password||!email||!dob||!zipcode||!phone) {
        return res.sendStatus(400).send('Every items of userinfo is required!');
    }
    let exist = await User.findOne({'username': username});
    if(exist){
        return res.sendStatus(400).send('Username is already existed!');
    }
    let userinfo = await Profile.create({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        dob: req.body.dob,
        zipcode: req.body.zipcode,
        headline: req.body.headline,
        avatar: req.body.avatar,
    })
    let salt = username + new Date().getTime();
    let hash = md5(salt + password);
    let user = await User.create({
        username: req.body.username,
        password: req.body.password,
        salt: salt,
        hash: hash,
    })

    return res.json({
        status: 'success',
        username: userinfo.username,
        email: userinfo.email,
        phone: userinfo.phone,
        dob: userinfo.dob,
        zipcode: userinfo.zipcode,
        password: user.password,
        headline: userinfo.headline,
        avatar: userinfo.avatar,
    })
}

const putPassword= async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let email=req.body.email;
    let dob=req.body.dob;
    let zipcode=req.body.zipcode;
    let phone=req.body.phone;
    if (!username || !password||!email||!dob||!zipcode||!phone) {
        return res.sendStatus(400).send('Every items of userinfo is required!');
    }
    let user=await User.findOne({'username': username});
    if(!user){
        return res.sendStatus(401).send('User not existed!')
    }
    let salt = username + new Date().getTime();
    let hash = md5(salt + password);
    user.password = password;
    user.salt = salt;
    user.hash = hash;

    await user.save(errHandler);
    return res.json({status: 'success', username: user.username});
}

module.exports = (app) => {
    app.post('/login', postLogin);
    app.post('/register', postRegister);
    auth(app);
    app.put('/logout', putLogout);
    app.put('password',putPassword);
}
