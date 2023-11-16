import { Link as RouterLink } from 'react-router-dom';
import { Toolbar, Box, AppBar, Link, Typography, Stack, IconButton } from '@mui/material';
import logo from './logo.png'


export const NavNotAuth = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
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

                    <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                        EZECODE
                    </Typography>

                    <Stack direction='row' spacing={2}>
                        <Link variant='h6' component={RouterLink} color='inherit' to="/auth/login">
                            Inicia Sesión
                        </Link>
                        <Link variant='h6' component={RouterLink} color='inherit' to="/">
                            Buscar Cursos
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    )
}