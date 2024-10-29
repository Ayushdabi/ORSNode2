import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../environment.ts';
import Footer from './Footer';
import 'font-awesome/css/font-awesome.min.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ firstName: '', lastName: '', loginId: '' });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noRecords, setNoRecords] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = environment.apiUrl;

  const fetchUsers = (query = {}, page = 1) => {
    const filteredQuery = {};
    Object.keys(query).forEach(key => {
      if (query[key]) {
        filteredQuery[key] = query[key];
      }
    });

    const queryString = new URLSearchParams({ ...filteredQuery, page }).toString();

    fetch(`${apiUrl}/api/user/searchuser?${queryString}`, { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setNoRecords(data.users.length === 0);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    fetchUsers(searchQuery, currentPage);
  }, []);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      fetch(`${apiUrl}/api/user/deleteuser/${selectedUserId}`, {
        method: 'POST',
        credentials: 'include',
      })
        .then(response => {
          if (response.ok) {
            fetchUsers(searchQuery, currentPage);
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        })
        .finally(() => {
          setShowModal(false);
          setSelectedUserId(null);
        });
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchUsers(searchQuery, 1);
  };

  const handleResetClick = () => {
    setSearchQuery({ firstName: '', lastName: '', loginId: '' });
    setCurrentPage(1);
    fetchUsers({}, 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      fetchUsers(searchQuery, currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      fetchUsers(searchQuery, currentPage - 1);
    }
  };

  return (
    <div
      className="user-list-container"
      style={{
        backgroundColor: 'black',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        minHeight: '100vh',
        paddingTop: '75px',
        paddingBottom: '100px',
      }}
    >
      <style>
        {`
          .user-list-container {
            padding-top: 75px;
            padding-bottom: 100px;
          }

          .card {
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }

          .card-body {
            padding: 15px;
          }

          h1 {
            font-size: 2.5rem;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
          }

          .text-danger {
            font-weight: bold;
          }

          .card-title {
            font-size: 1.5rem;
            font-weight: bold;
          }

          .card-text {
            font-size: 1rem;
          }

          .action-buttons {
            margin-top: 10px;
          }
        `}
      </style>

      <h1 className="text-center" style={{ color: 'yellow' }}>USER LIST</h1>
      <div className="text-center mb-4">
        <input
          type="text"
          name="firstName"
          placeholder="Search by first name..."
          value={searchQuery.firstName}
          onChange={handleSearchChange}
          className="form-control d-inline w-25"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Search by last name..."
          value={searchQuery.lastName}
          onChange={handleSearchChange}
          className="form-control d-inline w-25 mx-2"
        />
        <input
          type="text"
          name="loginId"
          placeholder="Search by login ID..."
          value={searchQuery.loginId}
          onChange={handleSearchChange}
          className="form-control d-inline w-25"
        />
        <button onClick={handleSearchClick} className="btn btn-success mx-2">
          Search
        </button>
        <button onClick={handleResetClick} className="btn btn-warning">
          Reset
        </button>
      </div>

      {noRecords ? (
        <h3 className="text-center text-danger">No records found</h3>
      ) : (
        <table border="1px" style={{
          backgroundColor: 'black',
          border: '2px solid yellow',
        }} width="100%" align="center" className="table table-hover table-dark table-bordered">
          <thead align="center">
            <tr>
              <th style={{ color: 'skyblue' }}>S.NO</th>
              <th style={{ color: 'skyblue' }}>First Name</th>
              <th style={{ color: 'skyblue' }}>LastName</th>
              <th style={{ color: 'skyblue' }}>Login Id</th>
              <th style={{ color: 'skyblue' }}>DOB</th>
              <th style={{ color: 'skyblue' }}>Gender</th>
              <th style={{ color: 'skyblue' }}>Action</th>
            </tr>
          </thead>
          <tbody align="center">
            {users.map((users, index) => (
              <tr key={users._id}>
                <td>{(currentPage - 1) * 5 + index + 1}</td>
                <td>{users.firstName}</td>
                <td>{users.lastName}</td>
                <td>{users.loginId}</td>
                <td>{new Date(users.dob).toLocaleDateString()}</td>
                <td>{users.gender}</td>
                <td>
                  <Link to={`/editstudent/${users._id}`}>
                    <button className="btn btn-primary" style={{ marginRight: '10px', padding: '5px' }}><i className="fa fa-pencil" aria-hidden="true"></i></button>
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDeleteClick(users._id)} style={{ marginRight: '10px', padding: '5px' }}><i className="fa fa-trash" aria-hidden="true"></i></button>
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
                Are you sure you want to delete this user?
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

export default UserList;