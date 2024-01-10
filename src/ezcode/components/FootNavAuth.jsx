import { Link as RouterLink } from 'react-router-dom';
import { Toolbar, Box, AppBar, Link, Typography, IconButton } from '@mui/material';
import logo from './logo.png'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

export const FootNavAuth = () => {
    const tipo = localStorage.getItem('tipo')

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

                    <Typography color='white' sx={{ flexGrow: 1 }}>
                        <Link variant='h6' component={RouterLink} to="/terminos" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Terminos y Condiciones
                        </Link>
                    </Typography>

                    {tipo == "Administrador" ? (
                        null
                    ) :
                        <Typography sx={{ flexGrow: 1 }}>
                            <Link variant='h6' component={RouterLink} color='inherit' to="/contacto" sx={{ textDecoration: 'none' }}>
                                Contacto
                            </Link>
                        </Typography>
                    }

                    <a
                        href="https://www.instagram.com/eze.code?igsh=MTFxeHQwYWpvYTM2"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <InstagramIcon sx={{ marginTop: '5px', fontSize: '2rem' }} />
                    </a>

                    <a
                        href="https://www.facebook.com/ezecode.company"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <FacebookIcon sx={{ marginTop: '5px', fontSize: '2rem' }} />
                    </a>

                </Toolbar>
            </AppBar>
        </Box>
    )
}
