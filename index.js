const operations = require('./src/userOperations');
const profile=require('./src/profile');
const following=require('./src/following');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
global.mongoose = require('mongoose');
//const User = require('./src/userSchema');
const connectionString = 'mongodb+srv://Sandy:ZfCRBxHFX4GwpNsC@cluster0.od9xc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const cors=require('cors');
const articles=require('./src/articles');

const connector =mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
connector.then(() => {
    if (true) {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            if (err) return console.error(err);
            for (let i=0; i<names.length; i++) {
                if (names[i].name === "users") {
                    mongoose.connection.db.dropCollection('users', (err, result) => {
                        console.log('User collection dropped');
                    })
                }
                if (names[i].name === "profiles") {
                    mongoose.connection.db.dropCollection('profiles', (err, result) => {
                        console.log('Profile collection dropped');
                    })
                }
                if (names[i].name === "articles") {
                    mongoose.connection.db.dropCollection('articles', (err, result) => {
                        console.log('Articles collection dropped');
                    })
                }
            }
        })
    }
    console.log("MongoDB connected successfully!")
})
    .catch( err => console.error('MongoDB connection error: ', err));

module.exports.mongoose = mongoose;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.url);
    next();
})
app.get('/', (req, res) => {res.send('yl244-hw-backend')});


operations(app);
profile(app);
following(app);
articles(app);



// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
     const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
