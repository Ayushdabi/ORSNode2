const express = require('express');
const router = express.Router();
const marksheetService = require('../models/marksheet-model');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.use(isAuthenticated);

router.post('/addMarksheet', (req, res) => {
    marksheetService.addMarksheet(req.body)
        .then(result => res.status(201).json(result))
        .catch(error => {
            console.error('Error adding marksheet:', error);
            res.status(500).json({ error: error.message });
        });
});


router.post('/updateMarksheet/:id', (req, res) => {
    marksheetService.updateMarksheet(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error updating marksheet:', error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/deleteMarksheet/:id', (req, res) => {
    marksheetService.deleteMarksheet(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error deleting marksheet:', error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/getMarksheet/:id', (req, res) => {
    marksheetService.getMarksheetById(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error fetching marksheet:', error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/searchMarksheets', async (req, res) => {
    const nameQuery = req.query.name;
    const rollNoQuery = req.query.rollNo;
    let query = {};

    if (nameQuery) {
        query.name = { $regex: nameQuery, $options: 'i' };
    }

    if (rollNoQuery) {
        const rollNoNumber = Number(rollNoQuery);
        if (!isNaN(rollNoNumber)) {
            query.rollNo = rollNoNumber;
        } else {
            query.rollNo = { $regex: rollNoQuery, $options: 'i' };
        }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        const marksheets = await marksheetService.searchMarksheets(query, page, limit);
        const totalCount = await marksheetService.countMarksheets(query);

        res.json({
            marksheets,
            totalCount,
            page,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error('Error searching marksheets:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getMeritList', (req, res) => {
    marksheetService.getMeritList()
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error fetching merit list:', error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/findByRollNo/:rollNo', (req, res) => {
    marksheetService.findByRollNo(req.params.rollNo)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error fetching marksheet by roll number:', error);
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;