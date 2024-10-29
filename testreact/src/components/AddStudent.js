import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { environment } from '../environment.ts';
import { Avatar, Box, Button, Container, CssBaseline, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import Footer from './Footer';
import getLPTheme from './common/getLPTheme.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountCircle, Phone, School } from '@mui/icons-material';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Transgender from '@mui/icons-material/Transgender';


const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    school: '',
    dob: '',
    mobileNo: '',
    gender: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState({});
  const API_URL = environment.apiUrl;

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id]);

  const fetchStudentById = (studentId) => {
    fetch(`${API_URL}/api/student/getstudent/${studentId}`, { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch student');
        }
      })
      .then(data => {
        data.dob = new Date(data.dob).toISOString().split('T')[0];
        setFormData(data);
      })
      .catch(error => {
        console.error('Error fetching student:', error);
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
    if (!formData.subject) {
      isValid = false;
      messages.subject = 'Subject is required.';
    }
    if (!formData.school) {
      isValid = false;
      messages.school = 'School is required.';
    }
    if (!formData.dob) {
      isValid = false;
      messages.dob = 'Date of Birth is required.';
    }
    if (!formData.mobileNo) {
      isValid = false;
      messages.mobileNo = 'Mobile No is required.';
    }
    if (!formData.gender) {
      isValid = false;
      messages.gender = 'Gender is required.';
    }

    setValidationMessages(messages);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = id ? `${API_URL}/api/student/updatestudent/${id}` : `${API_URL}/api/student/addstudent`;
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
      setFormData({ name: '', subject: '', school: '', dob: '', mobileNo: '', gender: '' });
      navigate('/studentList');
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
          <Avatar
            sx={{ m: 1 }}>
            <AccountCircle style={{ color: 'black' }} />

          </Avatar>
          <Typography component="h1" variant="h5" color='black'>
            {id ? 'Update Student' : 'Add Student'}
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
                        <AccountCircle style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!validationMessages.subject}
                  helperText={validationMessages.subject}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SubjectIcon style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}

                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="school"
                  label="School"
                  value={formData.school}
                  onChange={handleChange}
                  error={!!validationMessages.school}
                  helperText={validationMessages.school}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  error={!!validationMessages.dob}
                  helperText={validationMessages.dob}
                  InputLabelProps={{ shrink: true }} InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="mobileNo"
                  label="Mobile No"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  error={!!validationMessages.mobileNo}
                  helperText={validationMessages.mobileNo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={!!validationMessages.gender}
                  helperText={validationMessages.gender}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Transgender style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
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
              {id ? 'Update Student' : 'Add Student'}
            </Button>
            <Link to="/studentList" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ m: 1 }}>Cancel</Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default StudentForm;