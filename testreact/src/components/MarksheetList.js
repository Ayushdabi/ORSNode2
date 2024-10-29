import React, { useEffect, useState } from 'react';
import { environment } from '../environment.ts';
import { Link } from 'react-router-dom';
import Footer from './Footer.js'; // Adjusted to kebab-case
import 'font-awesome/css/font-awesome.min.css';

const MarksheetList = ({ user }) => {
  const [marksheets, setMarksheets] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [rollNoQuery, setRollNoQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [selectedMarksheetId, setSelectedMarksheetId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5; // Constant updated to UPPERCASE_SNAKE_CASE

  const apiUrl = environment.apiUrl;

  const fetchMarksheetsAsync = (query = {}, page = 1) => {
    const filteredQuery = new URLSearchParams();
    Object.keys(query).forEach(key => {
      if (query[key]) {
        filteredQuery.append(key, query[key]);
      }
    });

    fetch(`${apiUrl}/api/marksheet/searchMarksheets?page=${page}&${filteredQuery.toString()}`, { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
      })
      .then(data => {
        setMarksheets(data.marksheets || []);
        setTotalPages(data.totalPages || 1);
        setNoResults(data.marksheets.length === 0);
      })
      .catch(error => {
        console.error('Error fetching marksheets:', error);
      });
  };

  useEffect(() => {
    fetchMarksheetsAsync({}, currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    fetchMarksheetsAsync({ name: nameQuery, rollNo: rollNoQuery }, 1);
  };

  const handleDeleteClick = (marksheetId) => {
    setSelectedMarksheetId(marksheetId);
    setShowModal(true);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMarksheetsAsync({ name: nameQuery, rollNo: rollNoQuery }, nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      fetchMarksheetsAsync({ name: nameQuery, rollNo: rollNoQuery }, previousPage);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedMarksheetId) {
      fetch(`${apiUrl}/api/marksheet/deleteMarksheet/${selectedMarksheetId}`, {
        method: 'POST',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok.');
          fetchMarksheetsAsync({}, currentPage);
        })
        .catch(error => {
          console.error('Error deleting marksheet:', error);
        })
        .finally(() => {
          setShowModal(false);
          setSelectedMarksheetId(null);
        });
    }
  };

  const calculateTotal = (marksheet) => {
    return (marksheet.physics || 0) + (marksheet.chemistry || 0) + (marksheet.maths || 0);
  };

  const calculatePercentage = (marksheet) => {
    const total = calculateTotal(marksheet);
    return (total / 300) * 100;
  };

  const calculatePassFail = (marksheet) => {
    return (marksheet.physics >= 33 && marksheet.chemistry >= 33 && marksheet.maths >= 33) ? 'Pass' : 'Fail';
  };

  const handleResetClick = () => {
    setNameQuery('');
    setRollNoQuery('');
    fetchMarksheetsAsync({}, currentPage);
  };

  return (
    <div
      style={{
        //  backgroundImage: `url('https://www.pixelstalk.net/wp-content/uploads/image10/Serene-beach-with-smooth-rocks-gentle-waves-colorful-sunset-1080p-HD-Wallpapers.jpg')`,

        backgroundColor: 'black',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        height: '100vh',
        paddingTop: '85px',
      }}
    >
      <h1 className="text-center" style={{ color: 'yellow' }}>MARKSHEET LIST</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          placeholder="Search by Name"
          className="form-control d-inline w-25 mx-2"

          style={{ padding: '3px', marginRight: '10px' }}
        />
        <input
          type="text"
          value={rollNoQuery}
          onChange={(e) => setRollNoQuery(e.target.value)}
          placeholder="Search by RollNo"
          className="form-control d-inline w-25 mx-2"

          style={{ padding: '3px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} className="btn btn-success btn-sm" style={{ padding: '3px', marginRight: '10px' }}>Search</button>
        <button onClick={handleResetClick} className="btn btn-warning btn-sm" style={{ padding: '3px', marginRight: '10px' }}>
          Reset
        </button>
      </div>

      {noResults ? (
        <h1 style={{ textAlign: 'center', color: 'red' }}>No records found</h1>
      ) : (
        <table border="1px" style={{
          backgroundColor: 'black',
          border: '2px solid yellow',
        }} width="100%" align="center" className="table table-hover table-dark table-bordered">
          <thead align="center">
            <tr>
              <th style={{ color: 'skyblue' }}>S.NO</th>
              <th style={{ color: 'skyblue' }}>Name</th>
              <th style={{ color: 'skyblue' }}>Roll No</th>
              <th style={{ color: 'skyblue' }}>Physics</th>
              <th style={{ color: 'skyblue' }}>Chemistry</th>
              <th style={{ color: 'skyblue' }}>Maths</th>
              <th style={{ color: 'skyblue' }}>Total</th>
              <th style={{ color: 'skyblue' }}>Percentage</th>
              <th style={{ color: 'skyblue' }}>Pass/Fail</th>
              <th style={{ color: 'skyblue' }}>Action</th>
            </tr>
          </thead>
          <tbody align="center">
            {marksheets.map((marksheet, index) => (
              <tr key={marksheet._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>{marksheet.name}</td>
                <td>{marksheet.rollNo}</td>
                <td>{marksheet.physics}</td>
                <td>{marksheet.chemistry}</td>
                <td>{marksheet.maths}</td>
                <td>{calculateTotal(marksheet)}</td>
                <td>{calculatePercentage(marksheet).toFixed(2)}%</td>
                <td>{calculatePassFail(marksheet)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteClick(marksheet._id)} style={{ marginLeft: '10px', padding: '5px' }}><i className="fa fa-trash" aria-hidden="true"></i></button>
                  <Link to={`/editmarksheet/${marksheet._id}`}>
                    <button className="btn btn-primary" style={{ marginLeft: '10px', padding: '5px' }}><i className="fa fa-pencil" aria-hidden="true"></i></button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={handlePrevious} disabled={currentPage === 1} className="btn btn-warning">Previous</button>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="btn btn-warning">Next</button>
      </div>

      {showModal && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this marksheet?</p>
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

export default MarksheetList;