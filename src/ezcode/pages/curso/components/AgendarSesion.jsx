import { useEffect, useState } from "react";
import { Button, Container, TextField, Typography, MenuItem, Select } from '@mui/material';
import ezcodeApi from "../../../../api/ezcodeApi";
import Swal from "sweetalert2";

export const AgendarSesion = ({ id }) => {
    const tipo = localStorage.getItem('tipo');

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [alumno, setAlumno] = useState('');
    const [profesor, setProfesor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [curso, setCurso] = useState({
        nombre: '',
        categoria: '',
        descripcion: '',
        acreditado: false,
        carpeta: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/${id}`);
                const courseDataFromServer = response.data.curso;
                setCurso(courseDataFromServer);

                const alumnoId = courseDataFromServer.alumno;
                const respAlumno = await ezcodeApi.get(`user/${alumnoId}`);
                setAlumno(respAlumno.data.alumno);

                const profeId = courseDataFromServer.profesor;
                const respProfe = await ezcodeApi.get(`profesor/${profeId}`);
                setProfesor(respProfe.data.profesor);

            } catch (error) {
                console.error('Error al obtener datos de usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleCreateEvent = async () => {
        try {
            const combinedDateTime = new Date(`${selectedDate}T${selectedTime}`);
            const response = await ezcodeApi.post('/calendar/crear-evento', {
                fecha: combinedDateTime.toISOString(),
                alumnoCorreo: `${alumno.correo}`,
                profesorCorreo: `${profesor.correo}`,
                nombreCurso: `${curso.nombre}`,
            });

            setIsButtonDisabled(true);

            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 10 * 60 * 1000);

            const url = response.data.url;

            const result = await Swal.fire({
                title: 'Sesión agendada en Meet',
                html: `Evento de meet en tu cuenta de calendar creado exitosamente, URL del evento: <a href="${url}" target="_blank">${url}</a>`,
                icon: 'success',
                confirmButtonText: 'Ok',
            });

            if (result.isConfirmed) {
                window.location.reload(false);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setIsButtonDisabled(false);
        }
    };

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 1);
    const maxDateString = maxDate.toISOString().split('T')[0];

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Agendar Sesión
            </Typography>

            <Typography variant="body1" gutterBottom>
                Fecha:
            </Typography>
            <TextField
                style={{ flex: 1, marginRight: '8px', backgroundColor: 'white', borderRadius: '8px' }}
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                inputProps={{ min: new Date().toISOString().split('T')[0], max: maxDateString }}
            />

            <Typography variant="body1" gutterBottom>
                Hora:
            </Typography>
            <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                fullWidth
                style={{ minWidth: '100px', backgroundColor: 'white' }}
            >
                {Array.from({ length: 13 }, (_, index) => {
                    const hour = index + 8;
                    return (
                        <MenuItem key={hour} value={`${hour < 10 ? '0' : ''}${hour}:00`}>
                            {`${hour < 10 ? '0' : ''}${hour}:00`}
                        </MenuItem>
                    );
                })}
            </Select>
            <br />
            <br />
            {!curso.acreditado ? (
                <Button variant="contained" style={{ backgroundColor: 'white', color: 'black' }} onClick={handleCreateEvent}
                    disabled={
                        tipo === "Profesor" || isButtonDisabled || !selectedDate || !selectedTime
                    }>
                    Agendar Sesión
                </Button>
            ) : (
                <Typography variant="h6" gutterBottom>
                    El curso esta finalizado, no se pueden agendar sesiones
                </Typography>
            )}
        </Container>
    );
};
