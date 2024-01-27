import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, Container, Button, IconButton, Tooltip, Avatar, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddUserModal from '../components/AddUserModal'; // Make sure the path is correct

const pages = ['Home', 'Users', 'Extras'];
const settings = ['Settings', 'Profile', 'Sufyan Khurram'];

function ResponsiveNavBar() {
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenAddUserModal = () => {
    setOpenModal(true);
  };

  const handleCloseAddUserModal = () => {
    setOpenModal(false);
  };

  const addUserButton = location.pathname === '/users' && (
    <Button
      variant="contained"
      color="success"
      startIcon={<AddCircleOutlineIcon />}
      onClick={handleOpenAddUserModal}
      sx={{
        margin: '0 10px',
        textTransform: 'none',
      }}
    >
      Add New User
    </Button>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#14213D', color: 'white' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" noWrap sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 'bold', cursor: 'pointer' }}>
                RedEye AccessHub
              </Typography>
            </Link>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
              {pages.map((page) => (
                <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }}>
                  <Link to={`/${page === 'Home' ? '' : page.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {page}
                  </Link>
                </Button>
              ))}
            </Box>

            {addUserButton}

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="../pictures/selfpic.jpg" sx={{ border: '2px solid white' }} />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Link to={`/${setting.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center">{setting}</Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AddUserModal open={openModal} handleClose={handleCloseAddUserModal} />
    </>
  );
}

export default ResponsiveNavBar;
