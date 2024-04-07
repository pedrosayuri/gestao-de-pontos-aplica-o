import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import * as jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const settings = ['Perfil', 'Sair'];

interface DecodedToken {
  name: string;
  roles: string[];
}

export function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuário");
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  }

  const decodeToken = () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode.jwtDecode(token);
        setUsername(capitalizeFirstLetterOfEachWord(decodedToken.name));
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }

  function capitalizeFirstLetterOfEachWord(string: string) {
    return string.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/')
  }

  useEffect(() => {
    decodeToken();
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccessAlarmsIcon 
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} 
            onClick={() => navigate('/home')}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => navigate('/home')}
          >
            PONTO FÁCIL
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <AccessAlarmsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} onClick={() => navigate('/home')} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} */}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="" />
                <div style={{ marginLeft: 15, color: 'white', display: 'block', fontSize: '16px' }}>
                  Bem vindo(a), {username}
                </div>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Sair' ? handleLogout : handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}