import { Link as RouterLink } from 'react-router-dom';
import { Toolbar, Box, AppBar, Link, Typography, IconButton } from '@mui/material';
import logo from './logo.png'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


export const NavNotAuth = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 1 }}
                    >
                        <Link component={RouterLink} color='inherit' to="/">
                            <img src={logo} alt="example" width="50" height="50" />
                        </Link>
                    </IconButton>

                    <Typography variant='h6' component={RouterLink} color='inherit' to="/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
                        EZECODE
                    </Typography>

                    <Typography variant='h6' component={RouterLink} color='inherit' to="/buscar" sx={{ textDecoration: 'none', padding: '10px' }}>
                        Buscar Cursos
                    </Typography>

                    <Link variant='h6' component={RouterLink} color='inherit' to="/buscar" sx={{ textDecoration: 'none', flexGrow: 1 }}>
                        <SearchOutlinedIcon sx={{ marginTop: '5px', fontSize: '2rem' }} />
                    </Link>

                    <Link variant='h6' component={RouterLink} color='inherit' to="/auth/login" sx={{ textDecoration: 'none', flexGrow: 1 }}>
                        Inicia Sesión
                    </Link>

                </Toolbar>
            </AppBar>
        </Box>
    )
}