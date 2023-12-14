import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Toolbar, Box, AppBar, Link, Stack, Typography } from '@mui/material';
import logo from './logo.png'


export const ClienteNav = () => {
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

                    <Link variant='h6' component={RouterLink} color='inherit' to="/user/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
                        Perfil
                    </Link>

                    <Link variant='h6' component={RouterLink} color='inherit' to="/user/cursos" sx={{ flexGrow: 1, textDecoration: 'none' }}>
                        Mis Cursos
                    </Link>

                </Toolbar>
            </AppBar>
        </Box>
    )
}