
const express = require('express');
const router = express.Router();
const studentService = require('../models/student-model');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.use(isAuthenticated);

router.post('/addstudent', (req, res) => {
    studentService.addStudent(req.body)
        .then(result => res.status(201).json(result))
        .catch(error => {
            console.error('error ========== >');
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});


router.get('/searchstudent', (req, res) => {
    const query = {};
    if (req.query.name) {
        query.name = new RegExp(req.query.name, 'i');
    }
    if (req.query.subject) {
        query.subject = new RegExp(req.query.subject, 'i');
    }
    if (req.query.mobileNo) {
        query.mobileNo = new RegExp(req.query.mobileNo, 'i');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    studentService.searchStudents(query, page, limit)
        .then(result => {
            res.json({
                students: result.students,
                total: result.total,
                page,
                totalPages: Math.ceil(result.total / limit)
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/prelod', (req, res) => {
    const query = {};
    if (req.query.name) {
        query.name = new RegExp(req.query.name, 'i');
    }
    if (req.query.subject) {
        query.subject = new RegExp(req.query.subject, 'i');
    }
    if (req.query.mobileNo) {
        query.mobileNo = new RegExp(req.query.mobileNo, 'i');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;

    studentService.searchStudents(query, page, limit)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/deletestudent/:id', (req, res) => {
    studentService.deleteStudent(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.post('/updatestudent/:id', (req, res) => {
    studentService.updateStudent(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/getstudent/:id', (req, res) => {
    studentService.getStudentById(req.params.id)
        .then(result => res.json(result))
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;