import { Link as RouterLink } from 'react-router-dom';
import { IconButton, Toolbar, Box, AppBar, Link, Typography, List, ListItem, Popover, ListItemText, Grid, Badge, Pagination } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from './logo.png'
import ezcodeApi from '../../api/ezcodeApi';
import { useEffect, useState } from 'react';


export const ClienteNav = () => {
    const [notifications, setNotifications] = useState([]);
    const [noLeidas, setnoLeidas] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedNotifications = notifications.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await ezcodeApi.get(`user/notificaciones/${userId}`);
                const acomodarNotificaciones = response.data.notificaciones.sort((a, b) => {
                    return new Date(b.fecha) - new Date(a.fecha);
                });

                const quitarHoraNotificaciones = acomodarNotificaciones.map(notification => {
                    const fechaSinHora = new Date(notification.fecha);
                    fechaSinHora.setHours(0, 0, 0, 0);
                    return {
                        ...notification,
                        fecha: fechaSinHora.toISOString().split('T')[0]
                    };
                });

                setNotifications(quitarHoraNotificaciones);
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleLimpiar = async () => {
        try {
            const response = await ezcodeApi.post(`user/notificaciones/${userId}`);
            if (response) {
                window.location.reload(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePopoverOpen = (event) => {
        setnoLeidas(false);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const open = Boolean(anchorEl);

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

                    <Typography color='white' sx={{ flexGrow: 1 }}>
                        <Link variant='h6' component={RouterLink} to="/user/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Perfil
                        </Link>
                    </Typography>

                    <Typography color='white' sx={{ flexGrow: 1 }}>
                        <Link variant='h6' component={RouterLink} to="/cliente/Cursos" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Mis Cursos
                        </Link>
                    </Typography>

                    <Typography color='white' sx={{ flexGrow: 1 }}>
                        <Link variant='h6' component={RouterLink} to="/cliente/calificaciones" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Calificaciones
                        </Link>
                    </Typography>

                    <IconButton color="inherit" onClick={handlePopoverOpen}>
                        <Badge
                            color="error"
                            invisible={!noLeidas}
                            badgeContent={notifications.length}>
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <List>
                            {displayedNotifications.map(notification => (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Grid>
                                                <span >
                                                    {notification.mensaje}
                                                </span>
                                            </Grid>
                                        }
                                        secondary={
                                            <Grid >
                                                <span >
                                                    Fecha: {notification.fecha}
                                                </span>
                                            </Grid>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Pagination
                            count={Math.ceil(notifications.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                        />

                        <IconButton color="inherit" onClick={handleLimpiar}>
                            <DeleteIcon />
                        </IconButton>
                    </Popover>
                </Toolbar>
            </AppBar>
        </Box>
    )
}