import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem, IconButton, Toolbar, Box, AppBar, Typography, Link } from '@mui/material';
import { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
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

                    <Typography variant='h6' component={RouterLink} color='inherit' to="/buscar" sx={{ textDecoration: 'none', padding: '10px' }}>
                        Buscar Cursos
                    </Typography>

                    <Link variant='h6' component={RouterLink} color='inherit' to="/buscar" sx={{ textDecoration: 'none', flexGrow: 1 }}>
                        <SearchOutlinedIcon sx={{ marginTop: '5px', fontSize: '2rem' }} />
                    </Link>

                    {tipo == "Administrador" ? (
                        null
                    ) :
                        <Typography sx={{ flexGrow: 1 }}>
                            <Link variant='h6' component={RouterLink} color='inherit' to="/contacto" sx={{ textDecoration: 'none' }}>
                                Contacto
                            </Link>
                        </Typography>
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
        </Box >
    )
}
