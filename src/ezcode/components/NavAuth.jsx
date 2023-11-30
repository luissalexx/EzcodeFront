import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem, IconButton, Toolbar, Box, AppBar, Typography, Link } from '@mui/material';
import { useState } from 'react';
import logo from './logo.png'


export const NavAuth = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate()
    const tipo = localStorage.getItem('tipo')

    const isMenuOpen = Boolean(anchorEl);

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload(false);
    }

    const handleOnClick = () => {
        handleMenuClose();
        handleLogout();
    }

    const handlePanelClick = () => {
        handleMenuClose();
        switch (tipo) {
            case "Alumno":
                navigate('/user/', {
                    replace: true
                });
                break;
            case "Profesor":
                navigate('/profesor/', {
                    replace: true
                });
                break;
            case "Administrador":
                navigate('/admin/', {
                    replace: true
                });
                break;
            default:
                navigate('/', {
                    replace: true
                });
                break;
        }
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handlePanelClick}>Panel de cuenta</MenuItem>
            <MenuItem onClick={handleOnClick}>Cerrar Sesión</MenuItem>
        </Menu>
    );
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <Link color='inherit' component={RouterLink} to="/">
                            <img src={logo} alt="example" width="50" height="50" />
                        </Link>
                    </IconButton>

                    <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                        EZECODE
                    </Typography>

                    <Link variant='h6' component={RouterLink} color='inherit' to="/" sx={{ flexGrow: 1 }}>
                        Buscar Cursos
                    </Link>
                    {tipo == "Administrador" ? (
                        null
                    ) :
                        <Link variant='h6' component={RouterLink} color='inherit' to="/contacto" sx={{ flexGrow: 1 }}>
                            Contacto
                        </Link>
                    }
                    <Box >
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle fontSize='large' />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    )
}
