import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ToggleColorMode from './ToggleColorMode';
import myLogo from '../../static/my-logo.png';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AuthService from "../../services/auth.service";
import AuthContext from '../../Auth/AuthContext';

const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode }) {
  const { user, logOut } = React.useContext(AuthContext); 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const callLogout = () => {
    setAnchorEl(null);
    AuthService.logout();
    logOut(); 
  };

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to="/profile">My Profile</MenuItem>
      <MenuItem onClick={callLogout} component={Link} to="/signIn">Logout</MenuItem>
    </Menu>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <Link to="/">
                <img
                  src={myLogo}
                  style={logoStyle}
                  alt="logo of sitemark"
                />
              </Link>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {user && (
                  <MenuItem
                    component={Link}
                    to="/home"
                    sx={{ py: '6px', px: '12px' }}
                  >
                    <Typography variant="body2" color="text.primary">
                      Home
                    </Typography>
                  </MenuItem>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {user ? (
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  sx={(theme) => ({
                    color: theme.palette.mode === 'light' ? 'black' : 'white',
                    bgcolor: theme.palette.mode === 'light' ? 'white' : 'black',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    },
                    borderRadius: '50%',
                    padding: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow:
                      theme.palette.mode === 'light'
                        ? '0px 4px 10px rgba(0, 0, 0, 0.1)'
                        : '0px 4px 10px rgba(255, 255, 255, 0.1)',
                  })}
                >
                  <AccountCircle />
                </IconButton>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component={Link}
                    to="/signIn"
                  >
                    Sign in
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    component={Link}
                    to="/signUp"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
