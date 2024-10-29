import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { environment } from '../environment.ts';
import { Avatar, Box, Button, Container, CssBaseline, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import Footer from './Footer';
import getLPTheme from './common/getLPTheme.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountCircle } from '@mui/icons-material';

const MarksheetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    physics: '',
    chemistry: '',
    maths: ''
  });

  const [studentNames, setStudentNames] = useState([]);
  const [message, setMessage] = useState('');
  const [validationMessages, setValidationMessages] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = environment.apiUrl;

  useEffect(() => {
    fetchStudentNames();
    if (id) {
      fetchMarksheetById(id);
    }
  }, [id, API_URL]);

  const fetchStudentNames = () => {
    fetch(`${API_URL}/api/student/prelod`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setStudentNames(data.students.map(student => student.name));
      })
      .catch(error => console.error('Error fetching student names:', error));
  };

  const fetchMarksheetById = (marksheetId) => {
    fetch(`${API_URL}/api/marksheet/getMarksheet/${marksheetId}`, { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch marksheet');
        }
      })
      .then(data => {
        setFormData(data);
      })
      .catch(error => {
        console.error('Error fetching marksheet:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationMessages({ ...validationMessages, [name]: '' });
  };

  const validate = () => {
    let messages = {};
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      messages.name = 'Name is required.';
    }
    if (!formData.rollNo) {
      isValid = false;
      messages.rollNo = 'Roll No is required.';
    }
    if (!formData.physics || isNaN(formData.physics)) {
      isValid = false;
      messages.physics = 'Valid Physics marks are required.';
    }
    if (!formData.chemistry || isNaN(formData.chemistry)) {
      isValid = false;
      messages.chemistry = 'Valid Chemistry marks are required.';
    }
    if (!formData.maths || isNaN(formData.maths)) {
      isValid = false;
      messages.maths = 'Valid Maths marks are required.';
    }

    setValidationMessages(messages);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = id ? `${API_URL}/api/marksheet/updateMarksheet/${id}` : `${API_URL}/api/marksheet/addMarksheet`;
    const method = 'POST';
    setLoading(true);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Error submitting form');

      const data = await response.json();
      setMessage(data.message);
      setFormData({ name: '', rollNo: '', physics: '', chemistry: '', maths: '' });
      navigate('/MarksheetList');
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const LPtheme = createTheme(getLPTheme('light'));

  return (
    <ThemeProvider theme={LPtheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{
          marginTop: 13,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 15)',
        }}>
          <Avatar sx={{ m: 1, }}>
            <i className="fa fa-graduation-cap" aria-hidden="true" style={{ color: 'black' }}></i>          </Avatar>
          <Typography component="h1" variant="h5" color='black'>
            {id ? 'Update Marksheet' : 'Add Marksheet'}
          </Typography>

          {message && (
            <Typography variant="body1" sx={{ color: 'green', marginBottom: 2 }}>
              {message}
            </Typography>
          )}

          {loading && <Typography variant="body1" sx={{ color: 'blue' }}>Loading...</Typography>}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  name="name"
                  label="Student Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!validationMessages.name}
                  helperText={validationMessages.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-user" aria-hidden="true" style={{ color: 'black' }}></i> {/* Font Awesome icon */}
                      </InputAdornment>
                    ),
                  }}

                >
                  <MenuItem value="">-------Select Name-------</MenuItem>
                  {studentNames.length > 0 ? (
                    studentNames.map((name, index) => (
                      <MenuItem key={index} value={name}>{name}</MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No students found</MenuItem>
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="rollNo"
                  label="Roll No"
                  value={formData.rollNo}
                  onChange={handleChange}
                  error={!!validationMessages.rollNo}
                  helperText={validationMessages.rollNo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="physics"
                  label="Physics Marks"
                  type="number"
                  value={formData.physics}
                  onChange={handleChange}
                  error={!!validationMessages.physics}
                  helperText={validationMessages.physics}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-book" aria-hidden="true" style={{ color: 'black' }}></i> {/* Font Awesome icon */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="chemistry"
                  label="Chemistry Marks"
                  type="number"
                  value={formData.chemistry}
                  onChange={handleChange}
                  error={!!validationMessages.chemistry}
                  helperText={validationMessages.chemistry}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-book" aria-hidden="true" style={{ color: 'black' }}></i> {/* Font Awesome icon */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="maths"
                  label="Maths Marks"
                  type="number"
                  value={formData.maths}
                  onChange={handleChange}
                  error={!!validationMessages.maths}
                  helperText={validationMessages.maths}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-book" aria-hidden="true" style={{ color: 'black' }}></i> {/* Font Awesome icon */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                m: 1,
                backgroundColor: 'green',
              }}
            >
              {id ? 'Update Marksheet' : 'Add Marksheet'}
            </Button>
            <Link to="/MarksheetList" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ m: 1 }}>Cancel</Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default MarksheetForm;
