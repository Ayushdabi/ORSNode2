import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { environment } from '../environment.ts';
import { Avatar, Box, Button, Container, CssBaseline, Grid, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import { Person as PersonIcon, Lock as LockIcon, Email as EmailIcon, Transgender as TransgenderIcons, CalendarToday as CalendarTodayIcon, RollerShades, } from '@mui/icons-material';
import Footer from './Footer';
import getLPTheme from './common/getLPTheme.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loginId: '',
    password: '',
    dob: '',
    gender: '',
    role: ''
  });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(true);
  const [validationMessages, setValidationMessages] = useState({});
  const [loading, setLoading] = useState(false);

  const apiUrl = environment.apiUrl;

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${apiUrl}/api/user/getuser/${id}`, { credentials: 'include' })
        .then(response => {
          if (!response.ok) throw new Error('Error fetching user data');
          return response.json();
        })
        .then(data => {
          data.dob = new Date(data.dob).toISOString().split('T')[0];
          setFormData(data);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          setMessage('Failed to fetch user data.');
          setShowMessage(true);
        })
        .finally(() => setLoading(false));
    }
  }, [id, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationMessages({ ...validationMessages, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const messages = {};

    // Validation
    if (!formData.firstName) {
      valid = false;
      messages.firstName = 'First Name is required';
    }
    if (!formData.lastName) {
      valid = false;
      messages.lastName = 'Last Name is required';
    }
    if (!formData.loginId) {
      valid = false;
      messages.loginId = 'Login ID is required';
    } else if (!formData.loginId.endsWith('@gmail.com')) {
      valid = false;
      messages.loginId = 'Login ID must be a valid Gmail address';
    }
    if (!formData.password) {
      valid = false;
      messages.password = 'Password is required';
    }
    if (!formData.dob) {
      valid = false;
      messages.dob = 'Date of Birth is required';
    }
    if (!formData.gender) {
      valid = false;
      messages.gender = 'Gender is required';
    }
    if (!formData.role) {
      valid = false;
      messages.role = 'Role is required';
    }

    setValidationMessages(messages);

    if (valid) {
      const url = id ? `${apiUrl}/api/user/updateuser/${id}` : `${apiUrl}/api/user/adduser`;
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

        setMessage(id ? 'User updated successfully!' : 'User added successfully!');
        setShowMessage(true);

        setFormData({
          firstName: '',
          lastName: '',
          loginId: '',
          password: '',
          dob: '',
          gender: '',
          role: ''
        });
        navigate('/UserList');
      } catch (error) {
        console.error('Error submitting form:', error);
        setMessage(error.message);
        setShowMessage(true);
      } finally {
        setLoading(false);
      }
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
          borderRadius: -5,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.9)',
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color='black'>
            {id ? 'Update User' : 'Add User'}
          </Typography>

          {showMessage && message && (
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
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!validationMessages.firstName}
                  helperText={validationMessages.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!validationMessages.lastName}
                  helperText={validationMessages.lastName} InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="loginId"
                  label="Login ID"
                  value={formData.loginId}
                  onChange={handleChange}
                  error={!!validationMessages.loginId}
                  helperText={validationMessages.loginId}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validationMessages.password}
                  helperText={validationMessages.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon style={{ color: 'black' }} />
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
                        <TransgenderIcons style={{ color: 'black' }} />
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
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  name="role"
                  label="Role"
                  value={formData.role}
                  onChange={handleChange}
                  error={!!validationMessages.role}
                  helperText={validationMessages.role}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <RollerShades style={{ color: 'black' }} />
                      </InputAdornment>
                    ),
                  }}

                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                backgroundColor: 'green',
                m: 1,
                fontSize: '12px',
                padding: '6px 12px'
              }}
            >
              {id ? 'Update User' : 'Add User'}
            </Button>
            <Link to="/UserList" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ m: 1 }}>Cancel</Button>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Container>
    </ThemeProvider>
  );
};

export default UserForm;