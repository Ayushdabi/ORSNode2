
const express = require('express');
const router = express.Router();
const user = require('../models/user-model');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.post('/authenticate', (req, res) => {
    user.authenticate_user(req.body.loginId, req.body.password)
        .then(user => {
            req.session.user = user; // Set user in session
            console.log(req.session.id, '======sessionid==========');
            res.json({ message: 'Authentication successful', user });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Logout failed' });
        } else {
            res.json({ message: 'Logout successful' });
        }
    });
});

router.post('/signup', (req, res) => {
    user.add_user(req.body)
        .then(result => res.status(201).json(result))
        .catch(error => {
            console.error('error ========== >');
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.use(isAuthenticated);

router.post('/adduser', (req, res) => {
    user.add_user(req.body)
        .then(result => res.status(201).json(result))
        .catch(error => {
            console.error('error ========== >');
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/searchuser', async (req, res) => {
    const query = {};
    if (req.query.firstName) {
        query.firstName = new RegExp(req.query.firstName, 'i');
    }
    if (req.query.lastName) {
        query.lastName = new RegExp(req.query.lastName, 'i');
    }
    if (req.query.loginId) {
        query.loginId = new RegExp(req.query.loginId, 'i');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        const users = await user.search_users(query, page, limit);
        const totalCount = await user.count_users(query);

        res.json({
            users,
            totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/deleteuser/:id', (req, res) => {
    user.delete_user(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/updateuser/:id', (req, res) => {
    user.update_user(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/getuser/:id', (req, res) => {
    user.get_user_by_id(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;
