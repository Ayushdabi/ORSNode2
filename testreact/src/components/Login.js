import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { environment } from '../environment.ts';
import Footer from './Footer.js';
import { Box, TextField, Button, Typography, Avatar, Container, CssBaseline } from '@mui/material';
import { Lock as LockIcon, Email as EmailIcon } from '@mui/icons-material';

const LoginForm = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [validationMessages, setValidationMessages] = useState({
    loginId: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationMessages({
      ...validationMessages,
      [name]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    let messages = {};

    if (!formData.loginId) {
      valid = false;
      messages.loginId = 'Login ID is required';
    } else if (!formData.loginId.endsWith('@gmail.com')) {
      valid = false;
      messages.loginId = 'Login ID is not in valid form';
    }
    if (!formData.password) {
      valid = false;
      messages.password = 'Password is required';
    }

    setValidationMessages(messages);

    const apiUrl = environment.apiUrl;

    if (valid) {
      console.log(apiUrl, " <======= url");
      fetch(`${apiUrl}/api/user/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Invalid credentials');
        })
        .then((data) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          setAuth(data.user);
          navigate('/welcome');
        })
        .catch((error) => {
          setMessage(error.message);
        });
    }
  };

  return (

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{
        marginTop: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.9)', // Soft shadow effect
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color='black'>
          SIGN IN
        </Typography>
        {message && <Typography variant="body1" color="error">{message}</Typography>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="loginId"
            label="Login ID"
            name="loginId"
            autoComplete="email"
            autoFocus
            value={formData.loginId}
            onChange={handleChange}
            error={!!validationMessages.loginId}
            helperText={validationMessages.loginId}
            InputProps={{
              startAdornment: (
                <EmailIcon />
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!validationMessages.password}
            helperText={validationMessages.password}
            InputProps={{
              startAdornment: (
                <LockIcon />
              ),
            }}
          />

          <Button
            type="submit"
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

          <Link to={'/signUp'} style={{ textDecoration: 'none' }}>
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
              SIGN UP
            </Button>
          </Link>
        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default LoginForm;