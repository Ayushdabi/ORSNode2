import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../environment.ts';
import Footer from './Footer';
import 'font-awesome/css/font-awesome.min.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState({ name: '', subject: '', mobileNo: '' });
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [recordNotFound, setRecordNotFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const apiUrl = environment.apiUrl;

    const fetchStudents = (query = {}, page = 1) => {
        const filteredQuery = {};
        Object.keys(query).forEach(key => {
            if (query[key]) filteredQuery[key] = query[key];
        });

        const queryString = new URLSearchParams({ ...filteredQuery, page }).toString();

        fetch(`${apiUrl}/api/student/searchstudent?${queryString}`, { credentials: 'include' })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => {
                setStudents(data.students);
                setTotalPages(data.totalPages);
                setRecordNotFound(data.students.length === 0);
            })
            .catch(error => console.error('Error fetching students:', error));
    };

    useEffect(() => {
        fetchStudents(searchQuery, currentPage);
    }, []);

    const handleDeleteClick = (studentId) => {
        setSelectedStudentId(studentId);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        fetch(`${apiUrl}/api/student/deletestudent/${selectedStudentId}`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(response => response.ok ? fetchStudents(searchQuery, currentPage) : Promise.reject())
            .catch(error => console.error('Error deleting student:', error))
            .finally(() => {
                setShowModal(false);
                setSelectedStudentId(null);
            });
    };

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchQuery(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchClick = () => {
        setCurrentPage(1);
        fetchStudents(searchQuery, 1);
    };

    const handleResetClick = () => {
        setSearchQuery({ name: '', subject: '', mobileNo: '' });
        setCurrentPage(1);
        fetchStudents({}, 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            fetchStudents(searchQuery, currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            fetchStudents(searchQuery, currentPage - 1);
        }
    };

    return (
        <div className="student-list-container" style={{
            backgroundColor: 'black',
            minHeight: '100vh',
            paddingTop: '75px',
            color: 'white'
        }}>
            <h1 className="text-center" style={{ color: 'yellow' }}>STUDENT LIST</h1>
            <div className="text-center mb-4">
                <input type="text" name="name" placeholder="Search by Student name..." value={searchQuery.name} onChange={handleSearchChange} className="form-control d-inline w-25" />
                <input type="text" name="sub`ject" placeholder="Search by Subject..." value={searchQuery.subject} onChange={handleSearchChange} className="form-control d-inline w-25 mx-2" />
                <input type="text" name="mobileNo" placeholder="Search by Mobile Number..." value={searchQuery.mobileNo} onChange={handleSearchChange} className="form-control d-inline w-25" />
                <button onClick={handleSearchClick} className="btn btn-success mx-2">Search</button>
                <button onClick={handleResetClick} className="btn btn-warning">Reset</button>
            </div>

            {recordNotFound ? (
                <h3 className="text-center text-danger">No records found</h3>
            ) : (
                <table border="1px" style={{
                    backgroundColor: 'black',
                    border: '2px solid yellow',
                }} width="100%" align="center" className="table table-hover table-dark table-bordered">
                    <thead align="center">
                        <tr>
                            <th style={{ color: 'skyblue' }}>S.NO</th>
                            <th style={{ color: 'skyblue' }}>Student Name</th>
                            <th style={{ color: 'skyblue' }}>Subject</th>
                            <th style={{ color: 'skyblue' }}>School</th>
                            <th style={{ color: 'skyblue' }}>DOB</th>
                            <th style={{ color: 'skyblue' }}>Mobile No</th>
                            <th style={{ color: 'skyblue' }}>Gender</th>
                            <th style={{ color: 'skyblue' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody align="center">
                        {students.map((student, index) => (
                            <tr key={student._id}>
                                <td>{(currentPage - 1) * 5 + index + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.subject}</td>
                                <td>{student.school}</td>
                                <td>{new Date(student.dob).toLocaleDateString()}</td>
                                <td>{student.mobileNo}</td>
                                <td>{student.gender}</td>
                                <td>
                                    <Link to={`/editstudent/${student._id}`}>
                                        <button className="btn btn-primary" style={{ marginRight: '10px', padding: '5px' }}><i className="fa fa-pencil" aria-hidden="true"></i></button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleDeleteClick(student._id)} style={{ marginRight: '10px', padding: '5px' }}><i className="fa fa-trash" aria-hidden="true"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="d-flex justify-content-between mt-3">
                <button onClick={handlePrevious} disabled={currentPage === 1} className="btn btn-warning">Previous</button>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="btn btn-warning">Next</button>
            </div>

            {showModal && (
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="close" aria-label="Close" onClick={() => setShowModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this student?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default StudentList;
