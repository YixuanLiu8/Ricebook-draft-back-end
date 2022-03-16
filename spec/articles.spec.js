/*
 * Test suite for articles
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;
const simulate2 = {
    username: "simulate2",
    email: "email2",
    phone: "phone2",
    dob: (new Date('09/09/1999')).toDateString(),
    zipcode: "zipcode2",
    password: "pw2",
    headline: "headline2",
    avatar: "avatar2",
}

const simulatePost={
    content:'simulatePost',
    image:'simulateImage',
}
describe('Validate Registration and Login functionality', () => {

    it('register new user', (done) => {
        fetch(url('/register'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(simulate2)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(simulate2.username);
            expect(res.email).toEqual(simulate2.email);
            expect(res.phone).toEqual(simulate2.phone);
            expect(res.zipcode).toEqual(simulate2.zipcode);
            expect(res.password).toEqual(simulate2.password);
            expect(res.headline).toEqual(simulate2.headline);
            expect(res.avatar).toEqual(simulate2.avatar);
            expect(res.status).toEqual('success');
            done();
        }).catch(err => {
            done(new Error(err))
        });
    });
    it('login simulate user1', (done) => {
        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'username': simulate2.username,
                'password': simulate2.password
            })
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            console.log("cookie is ", cookie);
            return res.json()
        }).then(res => {
            expect(res.user).toEqual(simulate2.user);
            expect(res.status).toEqual('success');
            done();
        }).catch(err => {
            done(new Error(err))
        });
    });
});

describe('Validate Articles functionality', () => {
    var articlesId;
    it('Post new articles', (done) => {
        fetch(url('/article'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
            body: JSON.stringify(simulatePost)
        }).then(res => res.json()).then(res => {
            articlesId = res.articles[0]._id;
            expect(res.articles[0].content).toEqual(simulatePost.content);
            done();
        })
            .catch(err => {
                done(new Error(err))
            });
    })
    //already post
    it('Get simulate user2 articles', (done) => {
        return fetch(url('/articles'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.articles.length).toEqual(1);
                expect(res.status).toEqual('success');
                done();
            })
            .catch(err => {done(new Error(err))});
    })
    it('Get article by articlesId', async (done) => {
        return fetch(url('/articles' + '/' + articlesId), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.articles.length).toEqual(1);
                expect(res.status).toEqual('success');
                done();
            })
            .catch(err => {done(new Error(err))});
    })
    it('update article with articlesId', async (done) => {
        return fetch(url('/articles' + '/' + articlesId), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie  },
            body: JSON.stringify({
                text: "Me just a puppy, me know nothing!"
            })
        })
            .then(res => res.json())
            .then(res => {
                expect(res.articles[0].content).toEqual("Me just a puppy, me know nothing!");
                expect(res.status).toEqual('success');
                done();
            })
            .catch(err => {done(new Error(err))});
    })

});

describe('Validate Logout functionality', () => {
    it('logout simulate user2', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie }
        }).then(res => res.json())
            .then(res => {
                expect(res.status).toEqual('success');
                done();
            }).catch(err => { done(new Error(err)) });
    });
});

