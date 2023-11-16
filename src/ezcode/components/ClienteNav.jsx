import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Toolbar, Box, AppBar, Link } from '@mui/material';
import logo from './logo.png'


export const ClienteNav = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Link component={RouterLink} color='inherit' to="/">
                        <img src={logo} alt="example" width="50" height="50" />
                    </Link>

                    <Link component={RouterLink} color='inherit' to="/">
                        Perfil
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    )
}