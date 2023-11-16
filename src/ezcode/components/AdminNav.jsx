import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Toolbar, Box, AppBar, Link, Typography, Stack } from '@mui/material';
import logo from './logo.png'


export const AdminNav = () => {
    
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
                    
                    <Stack direction='row' spacing={2} sx={{ flexGrow: 1 }}>
                        <Link variant='h6' component={RouterLink} color='inherit' to="/admin/" >
                            Perfil
                        </Link>
                        <Link variant='h6' component={RouterLink} color='inherit' to="/admin/solicitudes">
                            Solicitudes
                        </Link>
                    </Stack>
                    
                </Toolbar>
            </AppBar>
        </Box>
    )
} 