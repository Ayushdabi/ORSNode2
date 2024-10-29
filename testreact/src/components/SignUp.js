import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { environment } from '../environment.ts';
import getLPTheme from './common/getLPTheme.js';
import { InputAdornment, Avatar, Box, Button, Container, createTheme, CssBaseline, Grid, MenuItem, TextField, ThemeProvider, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { Email as EmailIcon, Person as PersonIcon, Lock as LockIcon, CalendarToday as CalendarTodayIcon, Transgender as TransgenderIcon } from '@mui/icons-material';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    loginId: '',
    password: '',
    dob: '',
    gender: '',
    role: 'student',
  });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [validationMessages, setValidationMessages] = useState({});

  const apiUrl = environment.apiUrl;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setValidationMessages(prevMessages => ({ ...prevMessages, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const messages = {};

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

    setValidationMessages(messages);

    if (valid) {
      try {
        const response = await fetch(`${apiUrl}/api/user/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Login Id already exists or unauthorized');
        }

        await response.json();
        setFormData({ firstName: '', lastName: '', loginId: '', password: '', dob: '', gender: '', role: 'student' });
        setMessage('User registered successfully, please login');
      } catch (error) {
        setMessage(error.message);
      } finally {
        setShowMessage(true);
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
          borderRadius: 2,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.9)',
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color='black'>
            USER REGISTRATION
          </Typography>

          {showMessage && (
            <Typography variant="body1" sx={{ color: 'green', marginBottom: 2 }}>
              {message}
            </Typography>
          )}

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {['firstName', 'lastName', 'loginId', 'password', 'dob', 'gender'].map((field, index) => (

                <Grid item xs={12} key={field}>
                  {field === 'gender' ? (
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
                            <TransgenderIcon style={{ color: 'black' }} />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      required
                      fullWidth
                      id={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      name={field}
                      type={field === 'password' ? 'password' : field === 'dob' ? 'date' : 'text'}
                      value={formData[field]}
                      onChange={handleChange}
                      autoComplete={field}
                      error={!!validationMessages[field]}
                      helperText={validationMessages[field]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {field === 'loginId' ? <EmailIcon style={{ color: 'black' }} /> : field === 'password' ? <LockIcon style={{ color: 'black' }} /> : field === 'dob' ? <CalendarTodayIcon style={{ color: 'black' }} /> : <PersonIcon style={{ color: 'black' }} />}
                          </InputAdornment>
                        ),
                      }}
                      InputLabelProps={field === 'dob' ? { shrink: true } : {}}
                    />
                  )}
                </Grid>
              ))}

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
                SUBMIT
              </Button>

              <Link to={'/login'} style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    m: 1,
                    fontSize: '12px',
                    padding: '6px 12px'
                  }}
                >
                  SIGN IN
                </Button>
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider >
  );
};

export default SignUp;