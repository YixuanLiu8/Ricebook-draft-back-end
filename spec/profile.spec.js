require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;
let cookie;

const simulate1={
    username: "simulate1",
    email: "email1",
    phone: "phone1",
    dob: (new Date('01/01/2000')).toDateString(),
    zipcode: "zipcode1",
    password: "pw1",
    headline: "headline1",
    avatar: "avatar1",}

describe('Validate Registration and Login functionality', () => {

    it('register new user', (done) => {
        fetch(url('/register'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(simulate1)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(simulate1.username);
            expect(res.email).toEqual(simulate1.email);
            expect(res.phone).toEqual(simulate1.phone);
            expect(res.zipcode).toEqual(simulate1.zipcode);
            expect(res.password).toEqual(simulate1.password);
            expect(res.headline).toEqual(simulate1.headline);
            expect(res.avatar).toEqual(simulate1.avatar);
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
                'username': simulate1.username,
                'password': simulate1.password
            })
        }).then(res => {
            cookie = res.headers.get('set-cookie');
            console.log("cookie is ", cookie);
            return res.json()
        }).then(res => {
            expect(res.user).toEqual(simulate1.user);
            expect(res.status).toEqual('success');
            done();
        }).catch(err => {
            done(new Error(err))
        });
    });
});

describe('Validate Get userinfo functionality', () => {
    it('get simulate user1 headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.headline).toEqual(simulate1.headline);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {
            done(new Error(err))
        });
    });
  it('get simulate user1 followers', (done) => {
        fetch(url('/following'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.follower.length).toEqual(0);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });

    it('get simulate user1 email', (done) => {
        fetch(url('/email'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.email).toEqual(simulate1.email);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });

    it('get simulate user1 zipcode', (done) => {
        fetch(url('/zipcode'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.zipcode).toEqual(simulate1.zipcode);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });
    it('get simulate user1 dob', (done) => {
        fetch(url('/dob'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect((new Date(res.dob)).toDateString()).toEqual(simulate1.dob);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });

    it('get simulate user1 avatar', (done) => {
        fetch(url('/avatar'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.avatars).toEqual(simulate1.avatars);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });
});

describe('Validate update userinfo functionality', () => {
    it('update simulate user1 headline', (done) => {
        fetch(url('/headline'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify({headline: 'updated headline1'})
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.headline).toEqual('updated headline1');
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });


    it('add new followers to simulate user1', (done) => {
        let newFollower = 'Sandy'
        fetch(url('/following/' + newFollower), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.follower.length).toEqual(1);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {

            done(new Error(err))
        });
    });

    it('delete simulate user1 followers', (done) => {
        let removeFollower = 'Sandy'
        fetch(url('/following/' + removeFollower), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.follower.length).toEqual(0);
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {

            done(new Error(err))
        });
    });

    it('update simulate user1 email', (done) => {
        fetch(url('/email'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify({email: 'updated email1'})
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.email).toEqual('updated email1');
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });

    it('update simulate user1 zipcode', (done) => {
        fetch(url('/zipcode'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify({zipcode: 'updated zipcode1'})
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.zipcode).toEqual('updated zipcode1');
                expect(res.status).toEqual('success');
                done();
            }).catch(err => { done(new Error(err)) });
    });

    it('update simulate user1 avatar', (done) => {
        fetch(url('/avatar'), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'cookie': cookie },
            body: JSON.stringify({avatars: 'updated avatar1'})
        })
            .then(res => res.json())
            .then(res => {
                expect(res.user).toEqual(simulate1.user);
                expect(res.avatars).toEqual('updated avatar1');
                expect(res.status).toEqual('success');
                done();
            }).catch(err => {done(new Error(err))});
    });
});

describe('Validate Logout functionality', () => {
    it('logout simulate user1', (done) => {
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
